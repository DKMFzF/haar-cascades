from __future__ import annotations

from typing import Protocol

import numpy as np

from src.domain.models import Face


class FaceDetector(Protocol):
    def detect(self, frame: np.ndarray) -> list[Face]: ...


class FrameDecoder(Protocol):
    def decode(self, data: bytes) -> np.ndarray | None: ...
