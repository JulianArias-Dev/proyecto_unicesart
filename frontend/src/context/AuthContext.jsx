import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PropTypes from 'prop-types';
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('El usuario debe ser usado con authProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const API = 'http://localhost:4000/api';
    const [user, setUser] = useState(null);
    const [ubicaciones, setUbicaciones] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        // Verificar si hay un token almacenado al cargar la página
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
    }, []);

    const handleAuthAction = async (action, data = {}, userId = null) => {
        try {
            let res;

            switch (action) {
                case 'signUp':
                    res = await axios.post(`${API}/register`, data, { withCredentials: true });
                    break;
                case 'signIn':
                    res = await axios.post(`${API}/login`, data, { withCredentials: true });
                    break;
                case 'logOut':
                    res = await axios.post(`${API}/logout`, user, { withCredentials: true });
                    break;
                case 'updateUser':
                    res = await axios.post(`${API}/updateuser`, data, { withCredentials: true });
                    break;
                case 'updatePassword':
                    res = await axios.put(`${API}/updatepassword`, data, { withCredentials: true });
                    break;
                case 'deleteAccount':
                    res = await axios.delete(`${API}/removeAccount`, {
                        params: { userId },
                        withCredentials: true
                    });
                    break;
                case 'getUbicaciones':
                    res = await axios.get(`${API}/ubicaciones`);
                    setUbicaciones(res.data);
                    return;
                case 'getProfile':
                    res = await axios.get(`${API}/profile`, {
                        params: { username: data.username },
                        withCredentials: true
                    });
                    return res.data;
                default:
                    throw new Error("Acción no válida");
            }

            // Manejo de resultados
            if (res.status === 200 || res.status === 201) {
                if (action === 'signUp' || action === 'signIn') {
                    setUser(res.data);
                    setIsAuthenticated(true);
                    sessionStorage.setItem('user', JSON.stringify(res.data));
                    withReactContent(Swal).fire({
                        title: action === 'signUp' ? "Usuario Registrado" : "Credenciales Correctas",
                        text: action === 'signUp' ? "¡Usuario registrado con éxito!" : "¡Bienvenido de nuevo!",
                        icon: "success"
                    });
                } else if (action === 'logOut' || action === 'deleteAccount') {
                    sessionStorage.removeItem('user');
                    setUser(null);
                    setIsAuthenticated(false);
                    withReactContent(Swal).fire({
                        title: action === 'logOut' ? "Sesión Cerrada" : "Cuenta Eliminada",
                        text: action === 'logOut' ? "¡Hasta pronto!" : "Se han eliminado todos los datos asociados a su cuenta.",
                        icon: action === 'logOut' ? "info" : "warning"
                    });
                } else if (action === 'updateUser' || action === 'updatePassword') {
                    setUser(res.data);
                    withReactContent(Swal).fire({
                        title: "Actualización",
                        text: action === 'updateUser' ? "Datos actualizados correctamente" : "Contraseña actualizada correctamente",
                        icon: "success"
                    });
                }
            } else {
                withReactContent(Swal).fire({
                    title: "Advertencia",
                    text: res.data?.message || "Ocurrió un error, por favor intente de nuevo.",
                    icon: "warning"
                });
            }
        } catch (error) {
            console.error(error);
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error en la operación solicitada.",
                icon: "error"
            });
            setErrors(error.response?.data || {});
            if (action === 'signIn' || action === 'logOut' || action === 'deleteAccount') {
                setUser(null);
                setIsAuthenticated(false);
            }
        }
    };

    // Funciones envueltas en useCallback para evitar recreación en cada render
    const getUserProfile = useCallback(async (username) => {
        return await handleAuthAction('getProfile', { username });
    }, [API]);

    const getUbicaciones = useCallback(async () => {
        await handleAuthAction('getUbicaciones');
    }, [API]);

    return (
        <AuthContext.Provider value={{
            signUp: (user) => handleAuthAction('signUp', user),
            signIn: (user) => handleAuthAction('signIn', user),
            logOut: () => handleAuthAction('logOut'),
            updateUser: (user) => handleAuthAction('updateUser', user),
            updatePassword: (userId, password, newPassword) => handleAuthAction('updatePassword', { userId, password, newPassword }),
            deleteAccount: (userId) => handleAuthAction('deleteAccount', {}, userId),
            getUserProfile,
            getUbicaciones,
            ubicaciones,
            user,
            isAuthenticated,
            errors,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
