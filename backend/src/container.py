from __future__ import annotations

import cv2 as cv

from src.application.native import NativeApp
from src.config.settings import Settings
from src.infrastructure.camera import Camera
from src.infrastructure.detector import HaarCascadeDetector
from src.infrastructure.frame_decoder import OpenCVFrameDecoder
from src.infrastructure.visualizer import DetectionVisualizer


def build_haar_detector(settings: Settings) -> HaarCascadeDetector:
    face_cascade = cv.CascadeClassifier()
    eyes_cascade = cv.CascadeClassifier()

    if not face_cascade.load(cv.samples.findFile(settings.face_cascade_path)):
        print("Error loading face cascade")
        exit(0)
    if not eyes_cascade.load(cv.samples.findFile(settings.eyes_cascade_path)):
        print("Error loading eyes cascade")
        exit(0)

    return HaarCascadeDetector(face_cascade, eyes_cascade)


def build_native_app(settings: Settings | None = None) -> NativeApp:
    settings = settings or Settings()

    detector = build_haar_detector(settings)
    camera = Camera(settings.camera_index)
    visualizer = DetectionVisualizer()
    
    return NativeApp(detector, camera, visualizer)


def build_api_services(
    settings: Settings | None = None,
) -> tuple[HaarCascadeDetector, OpenCVFrameDecoder]:
    settings = settings or Settings()
    detector = build_haar_detector(settings)
    return detector, OpenCVFrameDecoder()
