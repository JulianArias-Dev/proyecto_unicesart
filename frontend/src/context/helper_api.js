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

        const { status, message } = error;

        showError(`Error (${status})`, message); 
    }
};
