import cv2 as cv

try:
    from src.config import Config
except ModuleNotFoundError:
    from config import Config


class Core:
    def __init__(self, config: Config):
        self.config = config

    def detect(self, frame):
        frame_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
        frame_gray = cv.equalizeHist(frame_gray)

        detected_faces = []
        faces = self.config.face_cascade.detectMultiScale(frame_gray)
        for (x, y, w, h) in faces:
            detected_eyes = []
            for (ex, ey, ew, eh) in self.config.eyes_cascade.detectMultiScale(frame_gray[y:y + h, x:x + w]):
                eye_center_x = x + ex + ew // 2
                eye_center_y = y + ey + eh // 2
                radius = int(round((ew + eh) * 0.25))
                detected_eyes.append({
                    "cx": int(eye_center_x),
                    "cy": int(eye_center_y),
                    "radius": int(radius),
                })

            detected_faces.append({
                "x": int(x),
                "y": int(y),
                "w": int(w),
                "h": int(h),
                "eyes": detected_eyes,
            })

        return detected_faces

    def detect_and_display(self, frame):
        detections = self.detect(frame)
        for detection in detections:
            x = detection["x"]
            y = detection["y"]
            w = detection["w"]
            h = detection["h"]
            frame = cv.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 255), 4)
            for eye in detection["eyes"]:
                eye_center = (eye["cx"], eye["cy"])
                frame = cv.circle(frame, eye_center, eye["radius"], (255, 0, 0), 4)

        cv.imshow('Capture - Face detection', frame)