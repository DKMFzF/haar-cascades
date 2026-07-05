import type { Face } from "@/entities/detection";

export const drawFrameWithDetections = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  detections: Face[],
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;

  for (const face of detections) {
    ctx.strokeStyle = "#ff00ff";
    ctx.strokeRect(face.x, face.y, face.w, face.h);

    ctx.strokeStyle = "#ff0000";
    for (const eye of face.eyes) {
      ctx.beginPath();
      ctx.arc(eye.cx, eye.cy, eye.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
};
