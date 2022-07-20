import { authApi } from './auth';
import { rolesApi } from './roles';
import { floorApi } from './floor';

export type ApiErrorResponse = {
  status: string,
  messages: string[],
};

export const apiReducers = {
  [authApi.reducerPath]: authApi.reducer,
  [rolesApi.reducerPath]: rolesApi.reducer,
  [floorApi.reducerPath]: floorApi.reducer,
}

export const apiMiddlewares = [
  authApi.middleware,
  rolesApi.middleware,
  floorApi.middleware,
];
