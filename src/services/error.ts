import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

export type ApiErrorResponse = {
  errorCode: string;
  status: string;
  messages: string[];
};

export const isReduxError = <T>(obj: T): obj is T & FetchBaseQueryError => {
  // @ts-ignore
  return obj && 'data' in obj;
};

export const isApiError = <T>(obj: T): obj is T & ApiErrorResponse => {
  // @ts-ignore
  return obj && 'errorCode' in obj && 'messages' in obj;
};
