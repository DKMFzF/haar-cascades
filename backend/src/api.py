from contextlib import asynccontextmanager

import cv2 as cv
import numpy as np
import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

try:
    from src.config import Config
    from src.core import Core
    from src.schemas import DetectionResponse, Face
except ModuleNotFoundError:
    from config import Config
    from core import Core
    from schemas import DetectionResponse, Face


@asynccontextmanager
async def lifespan(app: FastAPI):
    config = Config()
    config.load_cascades()
    app.state.core = Core(config)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/detect", response_model=DetectionResponse)
async def detect(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    nparr = np.frombuffer(data, np.uint8)
    frame = cv.imdecode(nparr, cv.IMREAD_COLOR)
    if frame is None:
        raise HTTPException(status_code=400, detail="Failed to decode image")

    core: Core = app.state.core
    detections = core.detect(frame)
    return DetectionResponse(faces=[Face(**face) for face in detections])


@app.websocket("/ws/detect")
async def detect_ws(websocket: WebSocket):
    await websocket.accept()
    core: Core = app.state.core

    try:
        while True:
            data = await websocket.receive_bytes()
            if not data:
                await websocket.send_json({"faces": []})
                continue

            nparr = np.frombuffer(data, np.uint8)
            frame = cv.imdecode(nparr, cv.IMREAD_COLOR)
            if frame is None:
                await websocket.send_json({"faces": []})
                continue

            detections = core.detect(frame)
            await websocket.send_json({"faces": detections})
    except WebSocketDisconnect:
        return


if __name__ == "__main__":
    uvicorn.run("src.api:app", host="0.0.0.0", port=8000, reload=True)
