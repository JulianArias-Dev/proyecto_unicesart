import axios from 'axios';

const API = 'http://localhost:4000/api';

export const getUbicacionesRequest = () => axios.get(`${API}/ubicaciones`);
export const getCategoriasRequest = () => axios.get(`${API}/categorias`)