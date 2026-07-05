from pydantic import BaseModel


class Eye(BaseModel):
    cx: int
    cy: int
    radius: int


class Face(BaseModel):
    x: int
    y: int
    w: int
    h: int
    eyes: list[Eye]


class DetectionResponse(BaseModel):
    faces: list[Face]
