export type MountGuard = {
	isMounted: () => boolean;
	unmount: () => void;
};

export const createMountGuard = (): MountGuard => {
	let mounted = true;

	return {
		isMounted: () => mounted,
		unmount: () => {
			mounted = false;
		},
	};
};
