import { sendRequest } from './AxiosInstance';
import { showLoading, showSuccess, showError, closeAlert } from '../components/SweetAlertHelpers';

export const handleRequest = async (method, endpoint, data = {}, successMessage = '', show = true) => {
    if (show) showLoading();

    try {
        const res = await sendRequest(method, endpoint, data);
        closeAlert();
        if (successMessage) showSuccess(successMessage, "¡Operación realizada con éxito!");
        return res;
    } catch (error) {
        closeAlert();

        // Procesa y muestra los mensajes de error
        const { status, message, errors } = error;

        if (errors.length > 0) {
            // Error de validación: Muestra múltiples errores
            const formattedErrors = errors.join('\n'); // Combina errores en un string legible
            showError(`Error (${status})`, `${message}\n${formattedErrors}`);
        } else {
            // Error genérico
            showError(`Error (${status})`, message);
        }

        // Devuelve el error para permitir manejo adicional en la llamada
        throw error;
    }
};
