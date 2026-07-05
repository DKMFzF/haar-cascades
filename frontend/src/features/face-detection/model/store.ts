// import { create } from "zustand";

import { BaseStoreActions} from '@/shared/model/store/base-action';
import { createSelectors } from '@/shared/model/store/generateSelectors';
import { create } from '@/shared/model/store/stateCreateReseter';
import { Nullable } from '@/shared/model/type';

import { DETECTION_STATUS } from "./constants";

type State = {
  status: string;
  error: Nullable<string>;
}

type Actions = BaseStoreActions & {
  setStatus: (status: string) => void;
  setError: (error: Nullable<string>) => void;
}

type Store = State & Actions;

const initialState: State = {
  status: DETECTION_STATUS.initializing,
  error: null,
};

const useDetectionStoreBase = create<Store>()((set) => ({
	...initialState,
	setStatus: (status) => set({ status }),
	setError: (error) => set({ error }),
	reset: () => set(initialState),
}));

export const useDetectionStore = createSelectors(useDetectionStoreBase);
