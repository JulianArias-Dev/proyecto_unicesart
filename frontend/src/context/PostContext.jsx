// PostContext.js
import { createContext, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { handleRequest } from './helper_api'; // Centraliza lógica de solicitudes

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
    // Estados principales
    const [categorias, setCategorias] = useState([]);
    const [errors, setErrors] = useState([]);
    const [publicaciones, setPublicaciones] = useState([]);
    const [noticias, setNoticias] = useState([]);

    // CRUD para Publicaciones
    const fetchPosts = useCallback(async (params = {}) => {
        try {
            const res = await handleRequest('get', '/getPost', { params });
            setPublicaciones(res.data);
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    }, []);

    const createPost = async (formData) => {
        try {
            const res = await handleRequest('post', '/createPost', formData, "La publicación ha sido guardada");
            setPublicaciones((prev) => [...prev, res.data.post]);
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    };

    const updatePost = async (formData) => {
        try {
            await handleRequest('put', '/update-post', formData, "La publicación ha sido actualizada");
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    };

    const deletePost = async (id) => {
        try {
            await handleRequest('delete', `/remove-post?id=${id}`, {}, "La publicación ha sido eliminada");
            setPublicaciones((prev) => prev.filter((post) => post.id !== id));
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    };

    const putReaction = async (reaction) => {
        try {
            await handleRequest('put', '/reaction', reaction, null, false);
            
        } catch (error) {
            setErrors((prev) => [...prev, error]); // Manejo de errores local
        }
    };
    

    // CRUD para Categorías
    const fetchCategorias = useCallback(async () => {
        try {
            const res = await handleRequest('get', '/categorias');
            setCategorias(res.data);
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    }, []);

    // CRUD para Noticias/Anuncios
    const fetchAdds = useCallback(async () => {
        try {
            const res = await handleRequest('get', '/getAdds');
            setNoticias(res.data);
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    }, []);

    const saveAdd = async (formData) => {
        try {
            await handleRequest('post', '/save-new', formData, "El anuncio ha sido guardado con éxito");
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    };

    const updateAdd = async (formData) => {
        try {
            await handleRequest('put', '/update-new', formData, "El anuncio ha sido actualizado");
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    };

    const deleteAdd = async (id) => {
        try {
            await handleRequest('delete', `/delete-add?_id=${id}`, {}, "El anuncio ha sido eliminado");
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    };

    // CRUD para Comentarios
    const saveComment = async (formData) => {
        try {
            const res = await handleRequest('post', '/save-comment', formData, "El comentario ha sido guardado con éxito");
            return res.data;
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    };

    const updateComment = async (formData) => {
        try {
            const res = await handleRequest('put', '/update-comment', formData, "El comentario ha sido actualizado");
            return res.data;
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    };

    const deleteComment = async (id) => {
        try {
            await handleRequest('delete', `/delete-comment?_id=${id}`, {}, "El comentario ha sido eliminado");
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    };

    const fetchComments = async (id) => {
        try {
            const res = await handleRequest('get', `/getComments?_id=${id}`);
            return res.data;
        } catch (error) {
            setErrors((prev) => [...prev, error]);
        }
    };

    // Cargar Categorías al iniciar
    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    return (
        <PostContext.Provider
            value={{
                categorias,
                publicaciones,
                noticias,
                errors,
                setNoticias,
                setPublicaciones,
                fetchPosts,
                createPost,
                updatePost,
                deletePost,
                putReaction,
                saveComment,
                updateComment,
                deleteComment,
                fetchComments,
                fetchAdds,
                saveAdd,
                updateAdd,
                deleteAdd,
            }}
        >
            {children}
        </PostContext.Provider>
    );
};

PostProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
