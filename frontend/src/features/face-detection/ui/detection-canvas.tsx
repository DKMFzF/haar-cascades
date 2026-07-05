import { forwardRef } from "react";

export const DetectionCanvas = forwardRef<HTMLCanvasElement>(function DetectionCanvas(
  _,
  ref,
) {
  return (
    <canvas
      ref={ref}
      style={{
        width: "50%",
        height: "auto",
      }}
    />
  );
});
