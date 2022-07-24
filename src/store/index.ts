import { configureStore } from '@reduxjs/toolkit';

import { apiReducers, apiMiddlewares } from '../services';

import authReducer from './auth';
import buildingsReducer from './buildings';
import floorsReducer from './floors';
import profileReducer from './profile';
import rolesReducer from './roles';

const store = configureStore({
  reducer: {
    auth: authReducer,
    buildings: buildingsReducer,
    floors: floorsReducer,
    profile: profileReducer,
    roles: rolesReducer,
    ...apiReducers,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...apiMiddlewares),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;
