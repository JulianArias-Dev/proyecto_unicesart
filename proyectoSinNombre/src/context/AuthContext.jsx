import { createContext, useContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, logoutRequest, updateRequest, profileRequest, updatePasswordRequest, dropRequest,} from "../API/auth";
import { getUbicacionesRequest } from "../API/recursos";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('El usuario debe ser usado con authProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
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

    const singUp = async (user) => {
        try {
            const res = await registerRequest(user);

            if (res.status === 200) {
                withReactContent(Swal).fire({
                    title: "Usuario Registrado",
                    text: "¡Usuario Registrado con Éxito!",
                    icon: "success"
                });
                setUser(res.data);
                setIsAuthenticated(true);
                // Guardar el usuario en sesionStorage
                sessionStorage.setItem('user', JSON.stringify(res.data));
            } else {
                withReactContent(Swal).fire({
                    title: "Advertencia",
                    text: "Hubo un problema al registrar el usuario. Por favor, intente de nuevo.",
                    icon: "warning"
                });
            }
        } catch (error) {
            console.error(error);
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al registrar el usuario.",
                icon: "error"
            });
            setUser(null);
            setIsAuthenticated(false);
            setErrors(error.response.data);
        }
    };

    const singIn = async (user) => {
        try {
            const res = await loginRequest(user);

            if (res.status === 200) {
                withReactContent(Swal).fire({
                    title: "Credenciales Correctas",
                    text: "¡Bienvenido de Nuevo!",
                    icon: "success"
                });
                setUser(res.data);
                setIsAuthenticated(true);
                // Guardar el usuario en sesionStorage
                sessionStorage.setItem('user', JSON.stringify(res.data));
            } else {
                withReactContent(Swal).fire({
                    title: "Advertencia",
                    text: "No se han encontrado los datos: Usuario o contraseña incorrectos",
                    icon: "warning"
                });
            }
        } catch (error) {
            console.error(error);
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al iniciar sesión.",
                icon: "error"
            });
            setUser(null);
            setIsAuthenticated(false);
            setErrors(error.response.data);
        }
    };

    const logOut = async () => {
        try {
            const res = await logoutRequest();

            if (res.status === 200) {
                sessionStorage.removeItem('user');
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error(error);
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al cerrar sesión.",
                icon: "error"
            });
        }
    };

    const updateUser = async (user) => {
        try {

            const res = await updateRequest(user);

            if (res.status === 200) {
                withReactContent(Swal).fire({
                    title: "Actualizacion",
                    text: "¡Se han actualizado los datos Correctamente!",
                    icon: "success"
                });
                setUser(res.data);
            }

        } catch (error) {
            console.error(error);
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al actualizar los datos de usuario.",
                icon: "error"
            });
            setErrors(error.response.data);
        }
    }

    const updatePassword = async (userId, password, newPassword) => {
        try {
            const res = await updatePasswordRequest(userId, password, newPassword);

            if (res.status === 200) {
                withReactContent(Swal).fire({
                    title: "Actualizacion",
                    text: "¡Se ha actualizado su contraseña Correctamente!",
                    icon: "success"
                });
                setUser(res.data);
            }

        } catch (error) {
            console.error(error);
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al actualizar su contraseña.",
                icon: "error"
            });
            setErrors(error.response.data);
        }
    }

    const deleteAccount = async (userId) => {
        try {
            const res = await dropRequest(userId);

            if (res.status === 200) {
                sessionStorage.removeItem('user');
                await logoutRequest();                
                setIsAuthenticated(false);
                setUser(null);
                withReactContent(Swal).fire({
                    title: "Hasta Pronto",
                    text: "Se han eliminado todos los datos asociados a su cuenta",
                    icon: "warning"
                });
            }
         } catch (error) {
            console.error(error);
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al eliminar la cuenta.",
                icon: "error"
            });
        } 
    }

    const getUserProfile = async (username) => {
        try {
            const res = await profileRequest(username);

            if (res.status === 200) {
                return res.data;
            } else {
                withReactContent(Swal).fire({
                    title: "Advertencia",
                    text: "Error al consultar el perfil del usuario",
                    icon: "warning"
                });
            }

        } catch (error) {
            console.error(error);
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al buscar el usuario.",
                icon: "error"
            });
            setUser(null);
            setIsAuthenticated(false);
            setErrors(error.response.data);
        }
    }

    const getUbicaciones = async () => {
        try {

            const res = await getUbicacionesRequest();

            if (res.status === 200) {
                setUbicaciones(res.data);
            }

        } catch (error) {
            console.error(error);
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al Consultar base de datos.",
                icon: "error"
            });
            setUser(null);
            setIsAuthenticated(false);
            setErrors(error.response.data);
        }
    }

    return (
        <AuthContext.Provider value={{
            singUp,
            singIn,
            logOut,
            getUbicaciones,
            updateUser,
            updatePassword,
            getUserProfile,
            deleteAccount,
            ubicaciones,
            user,
            isAuthenticated,
            errors,
        }}>
            {children}
        </AuthContext.Provider>
    );
}