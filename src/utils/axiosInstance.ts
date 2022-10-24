import axios, { AxiosError, AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let retries = 0;

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // access token expired
    if (error.response.status === 401 && retries > 2) {
      retries += 1;
      return instance
        .put("/v1/auth/refresh")
        .then((res) => {
          if (res.status === 200) {
            return axios(originalRequest);
          }
        })
        .catch((refreshTokenErr) => {
          // refresh token expired
          if (refreshTokenErr.response.status === 401) {
            // logout
            return Promise.reject(refreshTokenErr);
          }
        });
    }
    retries = 0;
    return Promise.reject(error);
  }
);

const makeBaseQuery =
  () =>
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
  };

export default makeBaseQuery;
