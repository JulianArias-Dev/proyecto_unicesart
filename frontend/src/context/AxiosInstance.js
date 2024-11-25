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
        // Extraer información útil del error
        const errorDetails = {
            status: error.response?.status || 500, // Código de estado (500 por defecto)
            message: error.response?.data?.message || "Error inesperado.", // Mensaje de error del servidor
            data: error.response?.data || {}, // Cuerpo completo del error del servidor
        };

        // Lanzar error detallado
        throw errorDetails;
    }
};

export default axiosInstance;
