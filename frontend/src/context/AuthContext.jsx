import { createContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { handleRequest } from './helper_api';
import { showLoading, showError, closeAlert } from '../components/SweetAlertHelpers';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);

    // Cargar usuario de sessionStorage al iniciar
    useEffect(() => {
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
    }, []);

    // --- Funciones de Autenticación ---
    const signUp = async (userData) => {
        showLoading(); // Mostrar el cargador antes de la solicitud
        try {
            const res = await handleRequest('post', '/register', userData, "Usuario registrado con éxito");
            closeAlert(); // Cerrar el cargador al recibir respuesta
            if (res.data) {
                setUser(res.data);
                setIsAuthenticated(true);
            sessionStorage.setItem('user', JSON.stringify(res.data));
            }else{
                showError("Error al registrarse", res.message)
            }            
        } catch (error) {
            closeAlert();
            showError("Error al registrarse", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    };

    const signIn = async (credentials) => {
        showLoading();
        try {
            const res = await handleRequest('post', '/login', credentials, "¡Bienvenido de nuevo!");
            closeAlert();
            if (res.data) {
                setUser(res.data);
                setIsAuthenticated(true);
                sessionStorage.setItem('user', JSON.stringify(res.data));
            }else{
                showError("Error al registrarse", res.message)
            }
        } catch (error) {
            closeAlert();
            showError("Error al iniciar sesión", error.message || "Revisa tus credenciales.");
            setErrors((prev) => [...prev, error]);
        }
    };

    const logOut = async () => {
        showLoading();
        try {
            await handleRequest('post', '/logout', null, "Sesión cerrada correctamente");
            closeAlert();
            sessionStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            closeAlert();
            showError("Error al cerrar sesión", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    };

    const updateUser = async (userData) => {
        showLoading();
        try {
            const res = await handleRequest('post', '/updateuser', userData, "La información de tu cuenta ha sido actualizada.");
            closeAlert();
            setUser(res.data);
            sessionStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
            closeAlert();
            showError("Error al actualizar datos", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    };

    const updatePassword = async (passwordData) => {
        showLoading();
        try {
            await handleRequest('put', '/updatepassword', passwordData, "Tu contraseña se actualizó correctamente.");
        } catch (error) {
            closeAlert();
            showError("Error al actualizar contraseña", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    };

    const deleteAccount = async (userId) => {
        showLoading();
        try {
            await handleRequest('delete', `/removeAccount?userId=${userId}`, null, "Tu cuenta ha sido eliminada exitosamente.");
            closeAlert();
            sessionStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            closeAlert();
            showError("Error al eliminar cuenta", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    };

    const getUsers = async (query) => {
        showLoading();
        try {
            const res = await handleRequest('get', `/users`, { params: { query } });
            closeAlert();
            return res;
        } catch (error) {
            closeAlert();
            showError("Error en la busqueda de usuarios", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    }

    const getUserProfile = useCallback(async (username) => {
        showLoading();
        try {
            const res = await handleRequest('get', `/profile`, { params: { id: username } });
            closeAlert();
            return res.data;
        } catch (error) {
            closeAlert();
            showError("Error al obtener perfil", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    }, []);

    // --- Función para Obtener Ubicaciones ---
    const getUbicaciones = useCallback(async () => {
        showLoading();
        try {
            const res = await handleRequest('get', '/ubicaciones');
            closeAlert();
            setUbicaciones(res.data);
        } catch (error) {
            closeAlert();
            showError("Error al obtener ubicaciones", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    }, []);

    // --- Estado y Funciones Expuestas ---
    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                errors,
                ubicaciones,
                setErrors,
                getUsers,
                getUbicaciones,
                signUp,
                signIn,
                logOut,
                updateUser,
                updatePassword,
                deleteAccount,
                getUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
