import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Role {
  id: number;
  name: string;
  permissions?: Permissions[];
}

export type RolesState = Record<number, Role>;

const initialState = null;

const rolesSlice = createSlice({
  name: 'roles',
  initialState: initialState as RolesState | null,
  reducers: {
    setRoles(_, action: PayloadAction<RolesState>) {
      return {
        ...action.payload,
      };
    },
    resetRoles() {
      return null;
    },
  },
});

export const { setRoles, resetRoles } = rolesSlice.actions;

export default rolesSlice.reducer;
