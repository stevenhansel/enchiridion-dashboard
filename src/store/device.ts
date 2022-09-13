import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CreateDeviceState = {
  id: number;
  accessKeyId: string;
  secretAccessKey: string;
}

const initialState = null;

const createDeviceSlice = createSlice({
  name: 'createDevice',
  initialState: initialState as CreateDeviceState | null,
  reducers: {
    setCreateDevice(state: CreateDeviceState | null, action: PayloadAction<CreateDeviceState>) {
      return { 
        ...state,
        id: action.payload.id,
        accessKeyId: action.payload.accessKeyId,
        secretAccessKey: action.payload.secretAccessKey,
      };
    },
  },
});

export const { setCreateDevice } = createDeviceSlice.actions;

export default createDeviceSlice.reducer;