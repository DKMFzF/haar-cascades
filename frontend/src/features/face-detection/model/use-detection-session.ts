"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import type { Nullable } from "@/shared/model/type";

import { createDetectionSessionController } from "./create-detection-session-controller";
import { useDetectionStore } from "./store";

type DetectionSessionRefs = {
  videoRef: RefObject<Nullable<HTMLVideoElement>>;
  canvasRef: RefObject<Nullable<HTMLCanvasElement>>;
};

export const useDetectionSession = (): DetectionSessionRefs => {
	const videoRef = useRef<Nullable<HTMLVideoElement>>(null);
	const canvasRef = useRef<Nullable<HTMLCanvasElement>>(null);

	const setStatus = useDetectionStore.use.setStatus();
	const setError = useDetectionStore.use.setError();
	const reset = useDetectionStore.use.reset();

	useEffect(() => {
		const controller = createDetectionSessionController({
			videoRef,
			canvasRef,
			reset,
			setStatus,
			setError,
		});

		void controller.start();

		return controller.stop;
	}, [reset, setError, setStatus]);

	return { videoRef, canvasRef };
};
