import { authApi } from './auth';
import { roleApi } from './role';

export type ApiErrorResponse = {
  status: string,
  messages: string[],
};

export const apiReducers = {
  [authApi.reducerPath]: authApi.reducer,
  [roleApi.reducerPath]: roleApi.reducer,
}

export const apiMiddlewares = [
  authApi.middleware,
  roleApi.middleware,
];
