import cv2 as cv

from src.domain.models import Eye, Face


class HaarCascadeDetector:
    def __init__(self, face_cascade: cv.CascadeClassifier, eyes_cascade: cv.CascadeClassifier):
        self._face_cascade = face_cascade
        self._eyes_cascade = eyes_cascade

    def detect(self, frame):
        frame_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
        frame_gray = cv.equalizeHist(frame_gray)

        detected_faces = []

        faces = self._face_cascade.detectMultiScale(frame_gray)
        for (x, y, w, h) in faces:
            detected_eyes = []

            for (ex, ey, ew, eh) in self._eyes_cascade.detectMultiScale(frame_gray[y : y + h, x : x + w]):
                eye_center_x = x + ex + ew // 2
                eye_center_y = y + ey + eh // 2
                radius = int(round((ew + eh) * 0.25))

                detected_eyes.append(
                    Eye(
                        cx=int(eye_center_x),
                        cy=int(eye_center_y),
                        radius=int(radius),
                    )
                )

            detected_faces.append(
                Face(
                    x=int(x),
                    y=int(y),
                    w=int(w),
                    h=int(h),
                    eyes=detected_eyes,
                )
            )

        return detected_faces
