import { create } from "zustand";

import { DETECTION_STATUS } from "./constants";

type DetectionStore = {
  status: string;
  error: string | null;
  setStatus: (status: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const initialState = {
  status: DETECTION_STATUS.initializing,
  error: null,
};

export const useDetectionStore = create<DetectionStore>((set) => ({
  ...initialState,
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
