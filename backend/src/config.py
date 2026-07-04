import cv2 as cv
from dotenv import load_dotenv

import os


class Config:
    def __init__(self):
        load_dotenv()

        self.FACE_CASCADE_PATH = os.getenv('FACE_CASCADE_PATH')
        self.EYES_CASCADE_PATH = os.getenv('EYES_CASCADE_PATH')
        self.CAMERA_INDEX = int(os.getenv('CAMERA_INDEX'))

        self.face_cascade = cv.CascadeClassifier()
        self.eyes_cascade = cv.CascadeClassifier()


    def load_cascades(self):
        if not self.face_cascade.load(cv.samples.findFile(self.FACE_CASCADE_PATH)):
            print('--(!)Error loading face cascade')
            exit(0)
        if not self.eyes_cascade.load(cv.samples.findFile(self.EYES_CASCADE_PATH)):
            print('--(!)Error loading eyes cascade')
            exit(0)