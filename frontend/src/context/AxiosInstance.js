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
        // Extraer y asegurar propiedades
        const status = error.response?.status || 500; // Código de estado
        const message = error.response?.data?.message || error.message || "Error inesperado.";
        const errors = error.response?.data?.errors || []; // Manejo de errores adicionales

        const errorDetails = { status, message, errors };
        console.error("Detalles del error:", errorDetails); // Depuración
        throw errorDetails; // Lanzar error procesado
    }
};

export default axiosInstance;
