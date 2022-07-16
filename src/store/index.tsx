import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth';
import profileReducer from './profile';

const store = configureStore({
  reducer: {auth: authReducer, profile: profileReducer},
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;