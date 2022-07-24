import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Floor } from '../types/store';

type FloorsState = Record<number, Floor>;

const initialState = null;

const floorsSlice = createSlice({
  name: 'floors',
  initialState: initialState as FloorsState | null,
  reducers: {
    setFloors(_: FloorsState | null, action: PayloadAction<FloorsState>) {
      return {
        ...action.payload,
      };
    },
    resetFloors() {
      return null;
    },
  },
});

export const { setFloors, resetFloors } = floorsSlice.actions;

export default floorsSlice.reducer;
