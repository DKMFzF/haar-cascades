import cv2 as cv

from config import Config


class Camera:
    def __init__(self, config: Config):
        self.config = config
        self.camera_device = None

    def open(self):
        self.camera_device = cv.VideoCapture(self.config.CAMERA_INDEX)
        if not self.camera_device.isOpened():
            print('Error opening camera device')
            exit(1)

    def close(self):
        if self.camera_device is not None:
            self.camera_device.release()
            self.camera_device = None

