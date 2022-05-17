import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASEURL,
  timeout: 10 * 1000,
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => config,
  (error:AxiosError) => {
    // console.log(error);
    window.$message.error(error.message);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error:AxiosError) => {
    // console.log(error);
    window.$message.error(error.message);
  },
);

export default instance;
