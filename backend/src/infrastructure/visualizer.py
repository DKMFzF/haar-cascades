import cv2 as cv

from src.domain.models import Face
from src.domain.protocols import FaceDetector


class DetectionVisualizer:
    WINDOW_NAME = "Haar Cascade test"

    def draw(self, frame, detections: list[Face]):
        for detection in detections:
            frame = cv.rectangle(
                frame,
                (detection.x, detection.y),
                (detection.x + detection.w, detection.y + detection.h),
                (255, 0, 255),
                4,
            )
            for eye in detection.eyes:
                eye_center = (eye.cx, eye.cy)
                frame = cv.circle(frame, eye_center, eye.radius, (255, 0, 0), 4)
        return frame

    def show(self, frame):
        cv.imshow(self.WINDOW_NAME, frame)

    def detect_and_display(self, detector: FaceDetector, frame):
        detections = detector.detect(frame)
        annotated = self.draw(frame, detections)
        self.show(annotated)
