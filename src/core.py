import cv2 as cv

from config import Config


class Core:
    def __init__(self, config: Config):
        self.config = config


    def detect_and_display(self, frame):
        frame_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
        frame_gray = cv.equalizeHist(frame_gray)

        faces = self.config.face_cascade.detectMultiScale(frame_gray)
        for (x, y, w, h) in faces:
            frame = cv.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 255), 4)

            for (ex, ey, ew, eh) in self.config.eyes_cascade.detectMultiScale(frame_gray[y:y+h, x:x+w]):
                eye_center = (x + ex + ew//2, y + ey + eh//2)
                radius = int(round((ew + eh)*0.25))
                frame = cv.circle(frame, eye_center, radius, (255, 0, 0 ), 4)

        cv.imshow('Capture - Face detection', frame)