import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true,
});

export const sendRequest = async (method, endpoint, data = {}, config = {}) => {
    try {
        const isGetMethod = method.toLowerCase() === 'get'; // Verifica si es una solicitud GET
        const response = await axiosInstance({
            method,
            url: endpoint,
            ...(isGetMethod ? { params: data.params } : { data }), // Maneja correctamente `params` para GET
            ...config,
        });
        return response;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default axiosInstance;
