from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from src.domain.models import DetectionResponse
from src.domain.protocols import FaceDetector, FrameDecoder

router = APIRouter(tags=["detect"])


@router.websocket("/ws/detect")
async def detect_ws(websocket: WebSocket):
    await websocket.accept()
    detector: FaceDetector = websocket.app.state.detector
    frame_decoder: FrameDecoder = websocket.app.state.frame_decoder

    try:
        while True:
            data = await websocket.receive_bytes()
            frame = frame_decoder.decode(data)
            if frame is None:
                await websocket.send_json(DetectionResponse(faces=[]).model_dump())
                continue

            detections = detector.detect(frame)
            response = DetectionResponse(faces=detections)
            await websocket.send_json(response.model_dump())
    except WebSocketDisconnect:
        return
