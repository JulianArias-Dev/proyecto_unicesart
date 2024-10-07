
import { createContext, useContext, useEffect, useState } from "react";
import { getCategoriasRequest } from "../API/recursos.js";
import { createPostRequest, getPostRequest, reactionRequest } from "../API/post.js"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import PropTypes from 'prop-types';

const PostContext = createContext();

export const usePost = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('El usuario debe ser usado con authProvider');
    }
    return context;
};

export const PostProvider = ({ children }) => {
    const [categorias, setCategorias] = useState([]);
    const [errors, setErrors] = useState([]);
    const [publicaciones, setPublicaciones] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await getCategoriasRequest();
                setCategorias(response.data);
            } catch (error) {
                setErrors(error);
                console.error('Error al obtener las categorías', error);
            }
        };

        fetchCategorias();
        getPost();
    }, []);

    const createPost = async (post) => {
        try {
            const res = await createPostRequest(post);

            if (res.status === 200) {
                withReactContent(Swal).fire({
                    title: "Nueva Publicación",
                    text: "¡Publicacion creada con éxito!",
                    icon: "success"
                });

            } else {
                withReactContent(Swal).fire({
                    title: "Advertencia",
                    text: "Hubo un problema al crear la publicacion. Por favor, intente de nuevo.",
                    icon: "warning"
                });
            }

        } catch (error) {
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al crear la publicación.",
                icon: "error"
            });
            setErrors(error.response.data);
        }
    }

    const getPost = async (userId = null, userName = null) => {
        let timerInterval;
        try {
            Swal.fire({
                title: "Cargando publicaciones...",
                html: "Por favor, espere.",
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    timerInterval = setInterval(() => { }, 150);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });

            const res = userId && userName
                ? await getPostRequest(userId, userName)
                : await getPostRequest();

            if (res.status === 200) {
                Swal.close();
                setPublicaciones(res.data);
            } else {
                Swal.fire({
                    title: "Advertencia",
                    text: "No se han encontrado Publicaciones, intente recargar la página.",
                    icon: "warning"
                });
            }
        } catch (error) {
            console.error(error);

            Swal.close();
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Error al consultar publicaciones.",
                icon: "error"
            });

            if (error.response) {
                setErrors(error.response.data);
            }
        }
    };


    const putReaction = async (reaction) => {
        try {
            console.log(reaction);
            const res = await reactionRequest(reaction);

            if (res.status === 200) {
                console.log(res.status);
            }

        } catch (error) {
            console.log(error);
            setErrors(error.response.data);
        }
    }

    return (
        <PostContext.Provider value={{
            categorias,
            errors,
            publicaciones,
            createPost,
            getPost,
            putReaction,
        }}>
            {children}
        </PostContext.Provider>
    );

}

PostProvider.propTypes = {
    children: PropTypes.node.isRequired,
};