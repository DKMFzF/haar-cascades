export type Eye = {
  cx: number;
  cy: number;
  radius: number;
};

export type Face = {
  x: number;
  y: number;
  w: number;
  h: number;
  eyes: Eye[];
};

export type DetectionResponse = {
  faces: Face[];
};
