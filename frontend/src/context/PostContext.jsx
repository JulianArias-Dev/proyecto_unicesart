import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PropTypes from 'prop-types';
import axios from 'axios';

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

    const handlePostCRUD = async (process, data = {}, id = null) => {
        let timerInterval;
        try {
            Swal.fire({
                title: "Procesando la solicitud...",
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

            let res;

            switch (process) {
                case 'create':
                    res = await axios.post(`${API}/createPost`, data, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    break;
                case 'update':
                    res = await axios.put(`${API}/update-post`, data, {
                        withCredentials: true,
                    });
                    break;
                case 'delete':
                    res = await axios.delete(`${API}/remove-post?id=${id}`, {
                        withCredentials: true,
                    });
                    break;
                case 'fetch':
                    res = await axios.get(`${API}/getPost`, { params: data });
                    setPublicaciones(res.data);
                    break;
                case 'fetchCategorias':
                    res = await axios.get(`${API}/categorias`);
                    setCategorias(res.data);
                    break;
                case 'reaction':
                    res = await axios.put(`${API}/reaction`, data, { withCredentials: true });
                    break;
                default:
                    throw new Error("Operación no válida");
            }

            if (res.status === 201 || res.status === 200) {
                if (process === 'fetch' || process === 'fetchCategorias') {
                    // Ya manejamos la respuesta en el fetch
                    Swal.close();
                } else {
                    withReactContent(Swal).fire({
                        title: process === 'create' ? "Publicación creada" : process === 'update' ? "Publicación actualizada" : "Publicación eliminada",
                        text: "¡Operación realizada con éxito!",
                        icon: "success"
                    });
                }
                return true;
            } else {
                withReactContent(Swal).fire({
                    title: "Advertencia",
                    text: res.data?.message || "Hubo un problema. Por favor, intente de nuevo.",
                    icon: "warning"
                });
                return false;
            }

        } catch (error) {
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al procesar la solicitud.",
                icon: "error"
            });

            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }
            return false;
        }
    };

    const getPost = useCallback((userId = null, userName = null) => {
        handlePostCRUD('fetch', { id: userId, username: userName });
    }, []);

    useEffect(() => {
        handlePostCRUD('fetchCategorias');
    }, []);

    return (
        <PostContext.Provider value={{
            categorias,
            errors,
            publicaciones,
            createPost: (formData) => handlePostCRUD('create', formData),
            getPost,
            putReaction: (reaction) => handlePostCRUD('reaction', reaction),
            updatePost: (formData) => handlePostCRUD('update', formData),
            deletePost: (id) => handlePostCRUD('delete', {}, id),
        }}>
            {children}
        </PostContext.Provider>
    );
}

PostProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
