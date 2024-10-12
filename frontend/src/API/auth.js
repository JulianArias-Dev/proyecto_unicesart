import axios from 'axios';

const API = 'http://localhost:4000/api';

export const registerRequest = (user) => axios.post(`${API}/register`, user, { withCredentials: true });

export const loginRequest = (user) => axios.post(`${API}/login`, user, { withCredentials: true });

export const logoutRequest = (user) => axios.post(`${API}/logout`, user, { withCredentials: true });

export const updateRequest = (user) => axios.post(`${API}/updateuser`, user, { withCredentials: true });

export const updatePasswordRequest = (userId, password, newPassword) => axios.put(`${API}/updatepassword`, { userId, password, newPassword }, { withCredentials: true });

export const recoverPasswordRequest = (newPassword, email) => axios.put(`${API}/recover-password`, { newPassword, email });

export const profileRequest = (username) => axios.get(`${API}/profile`, {
    params: { username }
}, { withCredentials: true },);

export const validateRequest = (userId, password, email) => axios.put(`${API}/set-recover-code`, { email, userId, password }, { withCredentials: true });

export const dropRequest = (userId) => 
    axios.delete(`${API}/removeAccount`, { 
        params: { userId }, 
        withCredentials: true 
    });

