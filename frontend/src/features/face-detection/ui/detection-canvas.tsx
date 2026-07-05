import { forwardRef } from "react";

export const DetectionCanvas = forwardRef<HTMLCanvasElement>(function DetectionCanvas(
  _,
  ref,
) {
  return (
    <canvas
      ref={ref}
      style={{
        border: "1px solid #444",
        borderRadius: 8,
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
});
