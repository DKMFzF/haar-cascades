import os

from dotenv import load_dotenv


class Settings:
    def __init__(self):
        load_dotenv()

        self.mod = (os.getenv("MOD") or "native").lower()
        self.face_cascade_path = os.getenv("FACE_CASCADE_PATH") or ""
        self.eyes_cascade_path = os.getenv("EYES_CASCADE_PATH") or ""
        self.camera_index = int(os.getenv("CAMERA_INDEX") or 0)
        self.allowed_origins = [
            origin.strip()
            for origin in (os.getenv("ALLOWED_ORIGINS") or "http://localhost:3000").split(",")
            if origin.strip()
        ]
        self.api_host = os.getenv("API_HOST") or "0.0.0.0"
        self.api_port = int(os.getenv("API_PORT") or 8000)
        self.api_reload = (os.getenv("API_RELOAD") or "true").lower() == "true"
