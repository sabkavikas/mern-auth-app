import axios from "axios"
import axiosAuthorized from '../helpers/axiosAuthorized'

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const signUp = async (data) => {
    return await axios.post(`${BASE_URL}/users/signup`, data);
}

export const login = async (data) => {
    return await axios.post(`${BASE_URL}/users/login`, data);
}

export const getProfile = async () => {
    return await axiosAuthorized.get(`${BASE_URL}/users/profile`);
}

export const updateProfile = async (data) => {
    return await axiosAuthorized.put(`/users/profile/${data?.get('id')}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
} 

export const deleteProfile = async (userId) => {
    return await axiosAuthorized.delete(`/users/account/${userId}`);
}