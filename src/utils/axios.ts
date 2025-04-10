import axios from 'axios';
import { useLoading } from '../hooks/useLoading';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

export const setupInterceptors = (startLoading: () => void, stopLoading: () => void) => {
  instance.interceptors.request.use(
    (config) => {
      startLoading();
      return config;
    },
    (error) => {
      stopLoading();
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      stopLoading();
      return response;
    },
    (error) => {
      stopLoading();
      return Promise.reject(error);
    }
  );
};

export default instance; 