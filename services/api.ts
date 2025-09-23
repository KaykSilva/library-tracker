import axios from "axios";
import Cookies from "js-cookie";

const url = `${process.env.NEXT_PUBLIC_API_URL}`;

export const Api = axios.create({
    baseURL: url,
    withCredentials: true, // Permite envio automático de cookies
});


Api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        if (token) {
            config.headers['x-access-token'] = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);