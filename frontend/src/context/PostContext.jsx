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
    const [noticias, setNoticias] = useState([]);

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
            let message;

            switch (process) {
                case 'create':
                    message = "La publicación ha sido guardada"
                    res = await axios.post(`${API}/createPost`, data, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    break;
                case 'update':
                    message = "La publicación ha sido actualizada"
                    res = await axios.put(`${API}/update-post`, data, {
                        withCredentials: true,
                    });
                    break;
                case 'delete':
                    message = "La publicación ha sido eliminada"
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
                if (process === 'fetch' || process === 'fetchCategorias' || process === "reaction") {
                    Swal.close();
                    return;
                } if (process === 'create') {
                    setPublicaciones([...publicaciones, res.data.post]);
                }
                withReactContent(Swal).fire({
                    title: message,
                    text: "¡Operación realizada con éxito!",
                    icon: "success"
                });
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

    const handleCommentsCrud = async (process, data = {}, id = null) => {
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
            let message;

            switch (process) {
                case 'saveComment':
                    message = "El comentario ha sido guardado con éxito"
                    res = await axios.post(`${API}/save-comment`, data, {
                        withCredentials: true,
                    });
                    break;
                case 'getComments':
                    res = await axios.get(`${API}/getComments?_id=${id}`);
                    break;
                case 'deleteComment':
                    message = "El comentario ha sido eliminado"
                    res = await axios.delete(`${API}/delete-comment?_id=${id}`, {
                        withCredentials: true,
                    });
                    break;
                case 'updateComment':
                    message = "El comentario ha actualizado"
                    res = await axios.put(`${API}/update-comment`, data, {
                        withCredentials: true,
                    });
                    break;

                default:
                    throw new Error("Operación no válida");
            }

            if (res.status === 201 || res.status === 200) {
                if (process === 'getComments') {
                    Swal.close();
                    if (res.data) {
                        return res.data;
                    }
                } else {
                    withReactContent(Swal).fire({
                        title: message,
                        text: "¡Operación realizada con éxito!",
                        icon: "success"
                    });
                }
                if (process === 'saveComment' || process === 'updateComment') {
                    if (res.data) {
                        return res.data;
                    }
                }
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
    }

    const handleAddviseCrud = async (process, data = {}, id = null) => {
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
            let message;

            switch (process) {
                case 'saveAdd':
                    message = "El comentario ha sido guardado con éxito"
                    res = await axios.post(`${API}/save-new`, data, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    break;
                case 'getAdds':
                    res = await axios.get(`${API}/getAdds`);
                    break;
                case 'deleteAdd':
                    message = "El comentario ha sido eliminado"
                    res = await axios.delete(`${API}/delete-add?_id=${id}`, {
                        withCredentials: true,
                    });
                    break;
                case 'updateAdd':
                    message = "El comentario ha actualizado"
                    res = await axios.put(`${API}/update-new`, data, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    break;

                default:
                    throw new Error("Operación no válida");
            }

            if (res.status === 201 || res.status === 200) {
                if (process === "getAdds") {
                    Swal.close();
                    console.log(res.data);
                    setNoticias(res.data);  
                } else {
                    withReactContent(Swal).fire({
                        title: message,
                        text: "¡Operación realizada con éxito!",
                        icon: "success"
                    });
                }
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
    }

    const getAdds = useCallback(() => {
        handleAddviseCrud('getAdds', {}, null);
    }, []);

    const getPost = useCallback((userId = null, userName = null, category = null) => {
        handlePostCRUD('fetch', { id: userId, username: userName, category: category });
    }, []);

    useEffect(() => {
        handlePostCRUD('fetchCategorias');
    }, []);

    return (
        <PostContext.Provider value={{
            categorias,
            errors,
            publicaciones,
            setPublicaciones,
            noticias,
            setNoticias,
            createPost: (formData) => handlePostCRUD('create', formData),
            getPost,
            putReaction: (reaction) => handlePostCRUD('reaction', reaction),
            updatePost: (formData) => handlePostCRUD('update', formData),
            deletePost: (id) => handlePostCRUD('delete', {}, id),
            getComment: (id) => handleCommentsCrud('getComments', {}, id),
            saveComment: (formData) => handleCommentsCrud('saveComment', formData),
            deleteComment: (id) => handleCommentsCrud('deleteComment', {}, id),
            updateComment: (formData) => handleCommentsCrud('updateComment', formData),
            getAdds,
            saveAdd: (formData) => handleAddviseCrud('saveAdd', formData, null),
            updateAdd: (formData) => handleAddviseCrud('updateAdd', formData, null),
            deleteAdd: (id) => handleAddviseCrud('deleteAdd', {}, id),
        }}>
            {children}
        </PostContext.Provider>
    );
}

PostProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
