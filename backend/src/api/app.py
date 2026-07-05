from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes.detect import router as detect_router
from src.api.routes.health import router as health_router
from src.config.settings import Settings

# TODO: убрать костыль
from src.container import build_api_services


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings: Settings = app.state.settings
    detector, frame_decoder = build_api_services(settings)
    app.state.detector = detector
    app.state.frame_decoder = frame_decoder
    yield


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()

    app = FastAPI(lifespan=lifespan)
    app.state.settings = settings

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(detect_router)

    return app


app = create_app()
