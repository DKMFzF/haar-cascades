import { IMAGE_QUALITY } from "../model/constants";

export const canvasToJpeg = async (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create frame blob"));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      IMAGE_QUALITY,
    );
  });
};

export const encodeCanvasFrame = async (
  canvas: HTMLCanvasElement,
): Promise<ArrayBuffer> => {
  const blob = await canvasToJpeg(canvas);
  return blob.arrayBuffer();
};
