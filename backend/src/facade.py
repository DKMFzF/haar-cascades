import cv2 as cv

from config import Config
from camera import Camera
from core import Core


class Facade:
    def __init__(self):
        self.config = Config()
        self.config.load_cascades()
        self.camera = Camera(self.config)
        self.core = Core(self.config)
        self.camera.open()

    def run(self):
        try:
            while True:
                ret, frame = self.camera.camera_device.read()
                if not ret or frame is None:
                    print('No captured frame')
                    break
                self.core.detect_and_display(frame)
                if cv.waitKey(10) == 27:
                    break
        finally:
            self.camera.close()
            cv.destroyAllWindows()