import axios from 'axios';

const API = 'http://localhost:4000/api';

export const registerRequest = (user) => axios.post(`${API}/register`, user, { withCredentials: true });
export const loginRequest = (user) => axios.post(`${API}/login`, user, { withCredentials: true });
export const logoutRequest = (user) => axios.post(`${API}/logout`, user, { withCredentials: true });
export const updateRequest = (user) => axios.post(`${API}/updateuser`, user, { withCredentials: true });
export const profileRequest = (username) => axios.get(`${API}/profile`, { withCredentials: true }, {
    params : { username }
});

