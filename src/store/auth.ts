import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  isAuth: boolean;
}

const initialState = {
  isAuth: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState as AuthState,
  reducers: {
    login() {
      return {
        isAuth: true,
      };
    },
    logout() {
      return {
        isAuth: false,
      };
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
