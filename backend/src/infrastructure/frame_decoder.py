from __future__ import annotations

import cv2 as cv
import numpy as np


class OpenCVFrameDecoder:
    def decode(self, data: bytes) -> np.ndarray | None:
        if not data:
            return None

        nparr = np.frombuffer(data, np.uint8)
        return cv.imdecode(nparr, cv.IMREAD_COLOR)
