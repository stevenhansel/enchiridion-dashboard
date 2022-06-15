import { createSlice } from '@reduxjs/toolkit';

export interface authState {
    isAuth: boolean,
  }

const initialState: authState = {
    isAuth: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state) {
            state.isAuth = true;
        },
    },
});

export const { login } = authSlice.actions

export default authSlice.reducer;

