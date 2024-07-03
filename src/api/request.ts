import axios from 'axios';
import axiosRetry from 'axios-retry';
import { load } from 'react-cookies';
import { type AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const whiteRetry = new Set(['ECONNABORTED', undefined, 0]);

const serviceAxios = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 15 * 1000,
    withCredentials: false,  // If cross-domain requests need to carry cookies
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    validateStatus() {
        return true;
    }
});

axiosRetry(serviceAxios, {
    retries: 2,
    shouldResetTimeout: true,
    retryDelay: (retryCount) => {
        return retryCount * 10000;
    },
    retryCondition: (err) => {
        // true means turn on automatic request sending, false means turn off automatic request sending
        const { code, message } = err;
        return whiteRetry.has(<string>code) || message.includes('timeout');
    }
});

serviceAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (/auth|signup/.test(config.url || '')) {
            return config;
        }

        const token = load('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('No token found');
        }

        console.log('Global request interceptor: Success');
        return config;
    },
    (err: AxiosError) => {
        console.log('Global request interceptor: handling request errors');
        return Promise.reject(err);
    }
);

serviceAxios.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log('Global request interceptor: Success');
        return response;
    },
    (err: AxiosError) => {
        console.log('Global request interceptor: handling response errors');
        return Promise.reject(err);
    }
);

function createRequest(service: AxiosInstance) {
    return function <T>(config: AxiosRequestConfig): Promise<T> {
        return service(config);
    };
}

export default createRequest(serviceAxios);
