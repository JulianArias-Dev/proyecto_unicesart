import { sendRequest } from './AxiosInstance';
import { showLoading, showSuccess, closeAlert } from '../Componets/SweetAlertHelpers.jsx';

export const handleRequest = async (method, endpoint, data = {}, successMessage = '') => {
    showLoading(); 
    const res = await sendRequest(method, endpoint, data); 

    closeAlert(); 

    if (successMessage) showSuccess(successMessage, "¡Operación realizada con éxito!");
    return res; 
};
