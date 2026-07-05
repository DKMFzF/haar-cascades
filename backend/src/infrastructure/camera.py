import cv2 as cv
from typing import Optional


class Camera:
    def __init__(self, camera_index: int):
        self.camera_index = camera_index
        self.camera_device: Optional[cv.VideoCapture] = None

    def open(self):
        self.camera_device = cv.VideoCapture(self.camera_index)
        if not self.camera_device.isOpened():
            print("Error opening camera device")
            exit(1)

    def read(self):
        if self.camera_device is None:
            return False, None
        return self.camera_device.read()

    def close(self):
        if self.camera_device is not None:
            self.camera_device.release()
            self.camera_device = None
