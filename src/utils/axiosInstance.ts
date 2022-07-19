import axios from 'axios';

import store from '../store';

import { logout } from '../store/auth'

export type ApiErrorResponse = {
  code: string;
  messages: string[];
}

const instance = axios.create({
  baseURL: 'https://enchiridion.stevenhansel.com/dashboard',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    // console.log('interceptor masuk', error)
    // access token expired
    if (error.response.status === 401) {
      // console.log('test masuk error');

      return instance
        .put('/v1/auth/refresh')
        .then((res) => {
          if (res.status === 200) {
            // console.log('test then promise');
            return axios(originalRequest);
          }
        })
        .catch((refreshTokenErr) => {
          // refresh token expired
          if (refreshTokenErr.response.status === 401) {
            // logout
            // console.log('test catch promise');
            store.dispatch(logout());
            return Promise.reject(refreshTokenErr);
          }
        });
    }
    return Promise.reject(error);
  },
);

const isAxiosError = axios.isAxiosError;

export { isAxiosError };

export default instance;