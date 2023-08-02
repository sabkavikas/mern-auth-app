import axios from "axios";
import { getToken, removeToken } from "./tokenHelper";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosAuthorized = axios.create({
    baseURL: BASE_URL,
});

axiosAuthorized.interceptors.response.use((response) => {
    // Return the response if it's successful
    return response;
},
    (error) => {
        // Handle response error
        if (error.response) {
            console.error('Response error:', error.response);

            // Perform specific actions based on the status code
            if (error.response.status === 401 || error.response.status === 403) {
                removeToken();
            }
        }

        // Return the rejected promise so that the error can be handled downstream
        return Promise.reject(error);
    })

axiosAuthorized.interceptors.request.use((config) => {
    // Modify the config to include the authorization header
    const token = getToken(); // Replace this with your actual authorization token
    config.headers.Authorization = `Bearer ${token}`;

    return config;
},
    (error) => {
        // Handle request error
        return Promise.reject(error);
    })

export default axiosAuthorized;
