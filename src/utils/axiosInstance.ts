import axios from 'axios';

export type ApiErrorResponse = {
  code: string;
  messages: string[];
}

const instance = axios.create({
  baseURL: 'https://enchiridion.stevenhansel.com/dashboard',
  headers: {
    'Content-Type': 'application/json',
  }
});

const isAxiosError = axios.isAxiosError;

export { isAxiosError };

export default instance;