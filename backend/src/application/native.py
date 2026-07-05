import cv2 as cv

from src.domain.protocols import FaceDetector
from src.infrastructure.camera import Camera
from src.infrastructure.visualizer import DetectionVisualizer


class NativeApp:
    def __init__(
        self,
        detector: FaceDetector,
        camera: Camera,
        visualizer: DetectionVisualizer,
    ):
        self.detector = detector
        self.camera = camera
        self.visualizer = visualizer

    def run(self):
        self.camera.open()
        try:
            while True:
                ret, frame = self.camera.read()
                if not ret or frame is None:
                    print("No captured frame")
                    break
                self.visualizer.detect_and_display(self.detector, frame)
                if cv.waitKey(10) == 27:
                    break
        finally:
            self.camera.close()
            cv.destroyAllWindows()
