import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Building } from '../types/store';

type BuildingsState = Record<number, Building>;

const initialState = null;

const buildingsSlice = createSlice({
  name: 'buildings',
  initialState: initialState as BuildingsState | null,
  reducers: {
    setBuildings(_: BuildingsState | null, action: PayloadAction<BuildingsState>) {
      return {
        ...action.payload,
      };
    },
    resetBuildings() {
      return null;
    },
  },
});

export const { setBuildings, resetBuildings } = buildingsSlice.actions;

export default buildingsSlice.reducer;
