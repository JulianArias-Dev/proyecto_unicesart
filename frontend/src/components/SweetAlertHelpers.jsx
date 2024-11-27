import Swal from 'sweetalert2';
import Alert from './alert';

export const showLoading = () => {
    Swal.fire({
        title: "Procesando la solicitud...",
        html: "Por favor, espere.",
        timerProgressBar: true,
        didOpen: () => Swal.showLoading(),
    });
};

export const showSuccess = (title, text) => {
    Alert.fire({ title, text, icon: 'success' });
};

export const showError = (title, text) => {
    Alert.fire({ title, text, icon: 'error' });
};

export const closeAlert = () => Swal.close();
