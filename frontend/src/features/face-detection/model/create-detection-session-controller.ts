import type { RefObject } from "react";

import type { Face } from "@/entities/detection";
import { wsDetectUrl } from "@/shared/config";
import {
	createAnimationLoop,
	createMountGuard,
	getErrorMessage,
} from "@/shared/lib";
import type { Nullable } from "@/shared/model/type";

import { createDetectionSocket } from "../api/detection-socket";
import { startCamera, stopStream } from "../lib/camera";
import { drawFrameWithDetections } from "../lib/draw-detections";
import { encodeCanvasFrame } from "../lib/frame-encoder";
import { DETECTION_STATUS, PROCESS_INTERVAL_MS } from "./constants";

type CreateDetectionSessionControllerParams = {
	videoRef: RefObject<Nullable<HTMLVideoElement>>;
	canvasRef: RefObject<Nullable<HTMLCanvasElement>>;
	reset: () => void;
	setStatus: (status: string) => void;
	setError: (error: Nullable<string>) => void;
};

type DetectionSessionController = {
	start: () => Promise<void>;
	stop: () => void;
};

export const createDetectionSessionController = ({
	videoRef,
	canvasRef,
	reset,
	setStatus,
	setError,
}: CreateDetectionSessionControllerParams): DetectionSessionController => {
	const mountGuard = createMountGuard();
	let stream: Nullable<MediaStream> = null;
	let socket: Nullable<WebSocket> = null;
	let detections: Face[] = [];
	let lastProcessed = 0;
	let frameInFlight = false;

	const closeSocket = () => {
		if (socket) {
			socket.close();
		}

		socket = null;
		frameInFlight = false;
	};

	const detectFrame = async () => {
		const canvas = canvasRef.current;
		if (!canvas || !socket || socket.readyState !== WebSocket.OPEN) {
			return;
		}

		const buffer = await encodeCanvasFrame(canvas);
		socket.send(buffer);
		frameInFlight = true;
	};

	const animationLoop = createAnimationLoop((time) => {
		const video = videoRef.current;
		const canvas = canvasRef.current;

		if (video && canvas) {
			drawFrameWithDetections(video, canvas, detections);
		}

		if (time - lastProcessed < PROCESS_INTERVAL_MS || frameInFlight) {
			return;
		}

		lastProcessed = time;
		void detectFrame().catch((error: unknown) => {
			if (!mountGuard.isMounted()) {
				return;
			}

			setError(getErrorMessage(error, DETECTION_STATUS.sendFrameError));
		});
	});

	const start = async (): Promise<void> => {
		reset();

		try {
			stream = await startCamera();
			if (!mountGuard.isMounted()) {
				stopStream(stream);
				stream = null;
				return;
			}

			const video = videoRef.current;
			const canvas = canvasRef.current;
			if (!video || !canvas) {
				throw new Error("Video or canvas element is not available");
			}

			video.srcObject = stream;
			await video.play();

			canvas.width = video.videoWidth || 640;
			canvas.height = video.videoHeight || 480;

			socket = createDetectionSocket(wsDetectUrl, {
				onOpen: () => {
					if (!mountGuard.isMounted()) {
						return;
					}

					setStatus(DETECTION_STATUS.connected);
				},
				onMessage: (data) => {
					detections = data.faces ?? [];
					frameInFlight = false;

					if (!mountGuard.isMounted()) {
						return;
					}

					setError(null);
					setStatus(DETECTION_STATUS.active);
				},
				onError: () => {
					frameInFlight = false;
					if (!mountGuard.isMounted()) {
						return;
					}

					setError(DETECTION_STATUS.wsError);
				},
				onClose: () => {
					frameInFlight = false;
					if (!mountGuard.isMounted()) {
						return;
					}

					setError(DETECTION_STATUS.wsClosed);
				},
			});

			animationLoop.start();
		} catch (error: unknown) {
			if (!mountGuard.isMounted()) {
				return;
			}

			setError(getErrorMessage(error, DETECTION_STATUS.cameraError));
		}
	};

	const stop = () => {
		mountGuard.unmount();
		animationLoop.stop();
		stopStream(stream);
		stream = null;
		closeSocket();
	};

	return { start, stop };
};
