"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import type { Face } from "@/entities/detection";
import { wsDetectUrl } from "@/shared/config";

import { createDetectionSocket } from "../api/detection-socket";
import { startCamera, stopStream } from "../lib/camera";
import { drawFrameWithDetections } from "../lib/draw-detections";
import { encodeCanvasFrame } from "../lib/frame-encoder";
import { DETECTION_STATUS, PROCESS_INTERVAL_MS } from "./constants";
import { useDetectionStore } from "./store";

type DetectionSessionRefs = {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export const useDetectionSession = (): DetectionSessionRefs => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const detectionsRef = useRef<Face[]>([]);
  const lastProcessedRef = useRef(0);
  const frameInFlightRef = useRef(false);

  const setStatus = useDetectionStore((state) => state.setStatus);
  const setError = useDetectionStore((state) => state.setError);
  const reset = useDetectionStore((state) => state.reset);

  useEffect(() => {
    let isMounted = true;

    reset();

    const stopLoop = () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
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

    const detectFrame = async () => {
      const canvas = canvasRef.current;
      const socket = socketRef.current;
      if (!canvas || !socket || socket.readyState !== WebSocket.OPEN) {
        return;
      }

      const buffer = await encodeCanvasFrame(canvas);
      socket.send(buffer);
      frameInFlightRef.current = true;
    };

    const renderLoop = (time: number) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas) {
        drawFrameWithDetections(video, canvas, detectionsRef.current);
      }

      if (
        time - lastProcessedRef.current >= PROCESS_INTERVAL_MS &&
        !frameInFlightRef.current
      ) {
        lastProcessedRef.current = time;
        void detectFrame().catch((err: unknown) => {
          if (!isMounted) {
            return;
          }

          setError(
            err instanceof Error ? err.message : DETECTION_STATUS.sendFrameError,
          );
        });
      }

      animationIdRef.current = requestAnimationFrame(renderLoop);
    };

    const start = async () => {
      try {
        const stream = await startCamera();
        if (!isMounted) {
          stopStream(stream);
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

        const socket = createDetectionSocket(wsDetectUrl, {
          onOpen: () => {
            if (isMounted) {
              setStatus(DETECTION_STATUS.connected);
            }
          },
          onMessage: (data) => {
            detectionsRef.current = data.faces ?? [];
            frameInFlightRef.current = false;

            if (isMounted) {
              setError(null);
              setStatus(DETECTION_STATUS.active);
            }
          },
          onError: () => {
            frameInFlightRef.current = false;
            if (isMounted) {
              setError(DETECTION_STATUS.wsError);
            }
          },
          onClose: () => {
            frameInFlightRef.current = false;
            if (isMounted) {
              setError(DETECTION_STATUS.wsClosed);
            }
          },
        });

        socketRef.current = socket;
        animationIdRef.current = requestAnimationFrame(renderLoop);
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : DETECTION_STATUS.cameraError);
        }
      }
    };

    void start();

    return () => {
      isMounted = false;
      stopLoop();
      stopStream(streamRef.current);
      streamRef.current = null;
      closeSocket();
    };
  }, [reset, setError, setStatus]);

  return { videoRef, canvasRef };
};
