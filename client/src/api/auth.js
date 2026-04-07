import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/auth`
  : 'http://localhost:5000/auth'

axios.defaults.withCredentials = true;

export const getMe = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/me`);
        return res.data;
    } catch {
        return null
    }
}

export const logout = () => {
    window.location.href = `${BASE_URL}/logout`;
}

export const loginWithGoogle = () => {
    window.location.href = `${BASE_URL}/google`
}