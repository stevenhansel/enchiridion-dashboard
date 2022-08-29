import { authApi } from './auth';
import { rolesApi } from './roles';
import { floorApi } from './floor';
import { buildingApi } from './building';
import { announcementApi } from './announcement'
import { requestApi } from './request';
import { deviceApi } from './device';
import { userApi } from './user';

export type ApiErrorResponse = {
  status: string,
  messages: string[],
};

export const apiReducers = {
  [authApi.reducerPath]: authApi.reducer,
  [rolesApi.reducerPath]: rolesApi.reducer,
  [floorApi.reducerPath]: floorApi.reducer,
  [buildingApi.reducerPath]: buildingApi.reducer,
  [announcementApi.reducerPath]: announcementApi.reducer,
  [requestApi.reducerPath]: requestApi.reducer,
  [deviceApi.reducerPath]: deviceApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
}

export const apiMiddlewares = [
  authApi.middleware,
  rolesApi.middleware,
  floorApi.middleware,
  buildingApi.middleware,
  announcementApi.middleware,
  requestApi.middleware,
  deviceApi.middleware,
  userApi.middleware,
];
