// AuthContext.js
import { createContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { handleRequest } from './helper_api'; // Centraliza solicitudes HTTP
import { showLoading, showSuccess, showError, closeAlert } from '../Componets/SweetAlertHelpers.jsx'; // Funciones de alertas

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
            const res = await handleRequest('post', '/register', userData);
            closeAlert(); // Cerrar el cargador al recibir respuesta
            setUser(res.data);
            setIsAuthenticated(true);
            sessionStorage.setItem('user', JSON.stringify(res.data));
            showSuccess("Usuario registrado con éxito", "¡Bienvenido!");
        } catch (error) {
            closeAlert();
            showError("Error al registrarse", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    };

    const signIn = async (credentials) => {
        showLoading();
        try {
            const res = await handleRequest('post', '/login', credentials);
            closeAlert();
            setUser(res.data);
            setIsAuthenticated(true);
            sessionStorage.setItem('user', JSON.stringify(res.data));
            showSuccess("Inicio de sesión exitoso", "¡Bienvenido de nuevo!");
        } catch (error) {
            closeAlert();
            showError("Error al iniciar sesión", error.message || "Revisa tus credenciales.");
            setErrors((prev) => [...prev, error]);
        }
    };

    const logOut = async () => {
        showLoading();
        try {
            await handleRequest('post', '/logout');
            closeAlert();
            sessionStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
            showSuccess("Sesión cerrada correctamente", "¡Hasta luego!");
        } catch (error) {
            closeAlert();
            showError("Error al cerrar sesión", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    };

    const updateUser = async (userData) => {
        showLoading();
        try {
            const res = await handleRequest('put', '/updateuser', userData);
            closeAlert();
            setUser(res.data);
            sessionStorage.setItem('user', JSON.stringify(res.data));
            showSuccess("Datos actualizados", "La información de tu cuenta ha sido actualizada.");
        } catch (error) {
            closeAlert();
            showError("Error al actualizar datos", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    };

    const updatePassword = async (passwordData) => {
        showLoading();
        try {
            await handleRequest('put', '/updatepassword', passwordData);
            closeAlert();
            showSuccess("Contraseña actualizada", "Tu contraseña se actualizó correctamente.");
        } catch (error) {
            closeAlert();
            showError("Error al actualizar contraseña", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    };

    const deleteAccount = async (userId) => {
        showLoading();
        try {
            await handleRequest('delete', `/removeAccount?userId=${userId}`);
            closeAlert();
            sessionStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
            showSuccess("Cuenta eliminada", "Tu cuenta ha sido eliminada exitosamente.");
        } catch (error) {
            closeAlert();
            showError("Error al eliminar cuenta", error.message || "Intenta nuevamente.");
            setErrors((prev) => [...prev, error]);
        }
    };

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
