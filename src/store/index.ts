import { configureStore } from '@reduxjs/toolkit';
import { apiReducers, apiMiddlewares } from '../services';
import profileReducer from './profile';
import rolesReducer from './roles';
import createDeviceReducer from './device';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    roles: rolesReducer,
    createDevice: createDeviceReducer,
    ...apiReducers,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(...apiMiddlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
