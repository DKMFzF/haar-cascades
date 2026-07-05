"use client";

import { useEffect, useRef, useState } from "react";

import type { DetectionResponse, Face } from "../types/detection";

const PROCESS_INTERVAL_MS = 150;
const IMAGE_QUALITY = 0.8;

export function FaceDetector() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const detectionsRef = useRef<Face[]>([]);
  const lastProcessedRef = useRef(0);
  const frameInFlightRef = useRef(false);

  const [status, setStatus] = useState("Инициализация камеры...");
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const wsUrl = apiUrl.replace(/^http/i, "ws");

  useEffect(() => {
    let isMounted = true;

    const stopLoop = () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };

    const stopStream = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    const closeSocket = () => {
      const socket = socketRef.current;
      if (socket) {
        socket.close();
      }
      socketRef.current = null;
      frameInFlightRef.current = false;
    };

    const drawCurrentFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 3;

      for (const face of detectionsRef.current) {
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

    const canvasToJpeg = async (canvas: HTMLCanvasElement): Promise<Blob> => {
      return await new Promise((resolve, reject) => {
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

    const detectFrame = async () => {
      const canvas = canvasRef.current;
      const socket = socketRef.current;
      if (!canvas || !socket || socket.readyState !== WebSocket.OPEN) {
        return;
      }

      const blob = await canvasToJpeg(canvas);
      const buffer = await blob.arrayBuffer();
      socket.send(buffer);
      frameInFlightRef.current = true;
    };

    const renderLoop = (time: number) => {
      drawCurrentFrame();

      if (
        time - lastProcessedRef.current >= PROCESS_INTERVAL_MS &&
        !frameInFlightRef.current
      ) {
        lastProcessedRef.current = time;
        void detectFrame()
          .catch((err: unknown) => {
            if (isMounted) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Не удалось отправить кадр по WebSocket",
              );
            }
          });
      }

      animationIdRef.current = requestAnimationFrame(renderLoop);
    };

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) {
          throw new Error("Video or canvas element is not available");
        }

        streamRef.current = stream;
        video.srcObject = stream;
        await video.play();

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const socket = new WebSocket(`${wsUrl}/ws/detect`);
        socket.binaryType = "arraybuffer";

        socket.onopen = () => {
          if (isMounted) {
            setStatus("WebSocket подключен, обнаружение лиц запущено");
          }
        };

        socket.onmessage = (event: MessageEvent<string>) => {
          try {
            const data = JSON.parse(event.data) as DetectionResponse;
            detectionsRef.current = data.faces ?? [];
            frameInFlightRef.current = false;
            if (isMounted) {
              setError(null);
              setStatus("Камера активна");
            }
          } catch {
            frameInFlightRef.current = false;
          }
        };

        socket.onerror = () => {
          frameInFlightRef.current = false;
          if (isMounted) {
            setError("WebSocket ошибка соединения с backend");
          }
        };

        socket.onclose = () => {
          frameInFlightRef.current = false;
          if (isMounted) {
            setError("WebSocket соединение закрыто");
          }
        };

        socketRef.current = socket;
        animationIdRef.current = requestAnimationFrame(renderLoop);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Не удалось запустить камеру");
        }
      }
    };

    void start();

    return () => {
      isMounted = false;
      stopLoop();
      stopStream();
      closeSocket();
    };
  }, [wsUrl]);

  return (
    <main style={{ display: "grid", justifyItems: "center", gap: 12, padding: 24 }}>
      <p>{error ?? status}</p>
      <video ref={videoRef} playsInline muted style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid #444",
          borderRadius: 8,
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </main>
  );
}
