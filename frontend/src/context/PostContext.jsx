
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import PropTypes from 'prop-types';
import axios from 'axios'

const PostContext = createContext();

export const usePost = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('El usuario debe ser usado con authProvider');
    }
    return context;
};

export const PostProvider = ({ children }) => {
    const API = 'http://localhost:4000/api';
    const [categorias, setCategorias] = useState([]);
    const [errors, setErrors] = useState([]);
    const [publicaciones, setPublicaciones] = useState([]);

    const createPost = async (formData) => {
        let timerInterval;
        try {
            Swal.fire({
                title: "Guardando la publicación...",
                html: "Por favor, espere.",
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    timerInterval = setInterval(() => { }, 200);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });

            const res = await axios.post(`${API}/createPost`, formData, {
                withCredentials: true, // Para enviar cookies si es necesario
                headers: {
                    'Content-Type': 'multipart/form-data', // axios automáticamente lo establece, pero es útil tenerlo presente
                },
            });

            if (res.status === 201) {  // Verifica el código de estado correcto para creación exitosa
                withReactContent(Swal).fire({
                    title: "Nueva Publicación",
                    text: "¡Publicación creada con éxito!",
                    icon: "success"
                });
                return true;
            } else {
                withReactContent(Swal).fire({
                    title: "Advertencia",
                    text: "Hubo un problema al crear la publicación. Por favor, intente de nuevo.",
                    icon: "warning"
                });
                return false;
            }

        } catch (error) {
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al crear la publicación.",
                icon: "error"
            });

            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }

            return false;
        }
    };

    const getPost = useCallback(async (userId = null, userName = null) => {
        try {
            let res;
            if (userId && userName) {
                res = await axios.get(`${API}/getPost`, { params: { id: userId, username: userName } });
            } else {
                res = await axios.get(`${API}/getPost`)
            }

            if (res.status === 200) {
                setPublicaciones(res.data); // Successful fetch
            }
        } catch (error) {
            console.error('Error during getPost request:', error);

            // Handle network error
            if (!error.response) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo contactar al servidor.",
                    icon: "error"
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: error.response.data?.message || "Error al consultar publicaciones.",
                    icon: "error"
                });
                setErrors(error.response.data);
            }
        }
    }, [API]);

    const putReaction = async (reaction) => {
        try {
            console.log(reaction);
            const res = await axios.put(`${API}/reaction`, reaction, { withCredentials: true });

            if (res.status === 200) {
                console.log(res.status);
            }

        } catch (error) {
            console.log(error);
            setErrors(error.response.data);
        }
    }

    const updatePost = async (formData) => {
        let timerInterval;
        try {
            Swal.fire({
                title: "Cargando publicaciones...",
                html: "Por favor, espere.",
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    timerInterval = setInterval(() => { }, 200);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });

            const res = await axios.put(`${API}/update-post`, formData, {
                withCredentials: true,  // Para enviar cookies si es necesario
            });

            if (res.status === 200) {  // Código correcto para actualización
                withReactContent(Swal).fire({
                    title: "Actualización de Publicación",
                    text: "¡Publicación actualizada con éxito!",
                    icon: "success"
                });
                return true;
            } else {
                withReactContent(Swal).fire({
                    title: "Advertencia",
                    text: "Hubo un problema al actualizar la publicación. Por favor, intente de nuevo.",
                    icon: "warning"
                });
                return false;
            }

        } catch (error) {
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al actualizar la publicación.",
                icon: "error"
            });

            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }

            return false;
        }
    };

    const deletePost = async (id) => {
        try {
            console.log(id);
            const res = await axios.delete(`${API}/remove-post?id=${id}`, {
                withCredentials: true, // Para enviar cookies si es necesario
            });

            if (res.status === 200 || res.status === 204) {  // Verifica si la eliminación fue exitosa
                withReactContent(Swal).fire({
                    title: "Eliminación de Publicación",
                    text: "¡Publicación eliminada con éxito!",
                    icon: "success"
                });
                return true;
            } else {
                withReactContent(Swal).fire({
                    title: "Advertencia",
                    text: "Hubo un problema al eliminar la publicación. Por favor, intente de nuevo.",
                    icon: "warning"
                });
                return false;
            }

        } catch (error) {
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al eliminar la publicación.",
                icon: "error"
            });

            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }

            return false;
        }
    };

    const fetchCategorias = useCallback(async () => {
        try {
            const response = await axios.get(`${API}/categorias`)
            setCategorias(response.data);
        } catch (error) {
            setErrors(error);
            console.error('Error al obtener las categorías', error);
        }
    }, []);  // No dependencies, so it won't change

    useEffect(() => {
        getPost(); // Call getPost to fetch the posts
        fetchCategorias();
    }, [fetchCategorias, getPost]);

    return (
        <PostContext.Provider value={{
            categorias,
            errors,
            publicaciones,
            createPost,
            getPost,
            putReaction,
            updatePost,
            deletePost,
        }}>
            {children}
        </PostContext.Provider>
    );

}

PostProvider.propTypes = {
    children: PropTypes.node.isRequired,
};