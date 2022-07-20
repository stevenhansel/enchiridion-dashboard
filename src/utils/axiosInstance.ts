import axios, { AxiosError, AxiosRequestConfig } from 'axios';

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

    // access token expired
    if (error.response.status === 401) {

      return instance
        .put('/v1/auth/refresh')
        .then((res) => {
          if (res.status === 200) {
            return axios(originalRequest);
          }
        })
        .catch((refreshTokenErr) => {
          // refresh token expired
          if (refreshTokenErr.response.status === 401) {
            // logout
            // console.log('test catch promise');
            return Promise.reject(refreshTokenErr);
          }
        });
    }
    return Promise.reject(error);
  },
);

const makeBaseQuery = () => (
  async ({ url, method, data, headers = {} }: AxiosRequestConfig) => {
    try {
      const result = await instance({
        url,
        method,
        data,
        headers,
      });

      return { data: result.data };
    } catch (axiosError: unknown) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
        },
      };
    }
  }
);

export default makeBaseQuery;
