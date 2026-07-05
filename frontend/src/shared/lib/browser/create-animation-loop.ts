import type { Nullable } from '@/shared/model/type';

export type AnimationLoop = {
	start: () => void;
	stop: () => void;
};

export const createAnimationLoop = (
	onFrame: (time: number) => void,
): AnimationLoop => {
	let frameId: Nullable<number> = null;

	const loop = (time: number) => {
		onFrame(time);
		frameId = requestAnimationFrame(loop);
	};

	return {
		start: () => {
			if (frameId !== null) return;

			frameId = requestAnimationFrame(loop);
		},
		stop: () => {
			if (frameId === null) return;

			cancelAnimationFrame(frameId);
			frameId = null;
		},
	};
};
