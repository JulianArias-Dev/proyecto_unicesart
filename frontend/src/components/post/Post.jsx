import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth, usePost, useReport } from "../../context/context";
import UpdatePostForm from "./update_post_from";
import ReportForm from '../reports/report_form';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import './Post.css';

const Post = ({ post, onDelete }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const dialogEditRef = useRef(null);
    const dialogReportRef = useRef(null);
    const { user, isAuthenticated } = useAuth();
    const { putReaction, deletePost, categorias, updatePost } = usePost();
    const { savePostReport } = useReport();
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const userIndex = post.likes.findIndex(
            like => like.user.id.toString() === user?.id
        );
        if (userIndex > -1) {
            setLiked(true);
        }
    }, [post.likes, user?.id]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const openDialog = (dialogRef) => {
        toggleMenu();
        if (!dialogRef.current?.open) {
            dialogRef.current.showModal();
        }
    };

    const closeDialog = (dialogRef) => {
        if (dialogRef.current?.open) {
            dialogRef.current.close();
        }
    };

    const handleReaction = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            putReaction({
                _id: post._id,
                user: {
                    id: user.id,
                    username: user.username
                }
            });

            setLiked(!liked);
        } else {
            Swal.fire({
                title: "Error",
                text: "Debe registrarse o Iniciar sesión para realizar esta acción.",
                icon: "error",
            });
        }
    };

    const handleEdit = () => {
        setIsOpen(false);
        openDialog(dialogEditRef);
    };

    const handleDelete = async () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    deletePost(post._id);
                    onDelete(post._id);
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    const handleSubmitEdit = async (data) => {
        const formData = new FormData();
        formData.append('id', data.id);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('image', data.image);
        formData.append('userid', data.user.id);
        formData.append('username', data.user.username);

        try {
            closeDialog(dialogEditRef);
            await updatePost(formData);
        } catch (error) {
            console.error("Error al modificar la publicación:", error);
            alert("Hubo un error al modificar la publicación.");
        }
    };

    // Mantener el handleSubmit para reportes, pero ahora se integrará con el componente ReportForm
    const handleSubmitReport = (formData) => {
        const data = {
            usuarioReporte: {
                id: user.id,
                username: user.username,
            },
            motivo: formData.motivo.join(", "), // Enviar motivos separados por coma
            descripcion: formData.descripcion, // Enviar la descripción directamente
            publicacionReportada: {
                id: post._id
            }
        };

        savePostReport(data);
        closeDialog(dialogReportRef);
    };

    const showOriginalSize = (event) => {
        const imgElement = event.target;
        const originalWidth = imgElement.naturalWidth;
        const originalHeight = imgElement.naturalHeight;

        const popup = window.open(
            "",
            "Image",
            `width=${originalWidth},height=${originalHeight}`
        );
        popup.document.write(
            `<img src="${imgElement.src}" style="width:100%; height:100%;">`
        );
    };


    return (
        <div className="post">
            <div className="post-top">
                <div className="userInfo">
                    <i className="fa-solid fa-user"></i>
                    <p><Link to={`/profile/${post.user.id}`}>{post.user.username}</Link></p>
                </div>
                {
                    (isAuthenticated) &&
                    <div className="report-dropdown">
                        <button style={{ textAlign: 'center' }} className="report-button" onClick={toggleMenu}>
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                    </div>
                }
                {isOpen && (
                    <ul className="report-menu">

                        {(post.user.id === user.id) ? (
                            <>
                                <li className="report-item">
                                    <button onClick={handleDelete} className="report-button">
                                        <i className="fa-solid fa-trash"></i> Eliminar Publicación
                                    </button>
                                </li>
                                {/* Mostrar botón "Editar Publicación" solo si no está en la ruta "/home" */}
                                {location.pathname !== '/home' && (
                                    <li className="report-item">
                                        <button onClick={handleEdit} className="report-button">
                                            <i className="fa-solid fa-pen"></i> Editar Publicación
                                        </button>
                                    </li>
                                )}
                            </>
                        ) : (
                            user.role !== "administrador" && (
                                <li className="report-item">
                                    <button onClick={() => openDialog(dialogReportRef)} className="report-button">
                                        <i className="fa-solid fa-flag"></i> Contenido inapropiado
                                    </button>
                                </li>
                            )
                        )}
                        {user.role === "administrador" && (
                            <li className="report-item">
                                <button onClick={handleDelete} className="report-button">
                                    <i className="fa-solid fa-trash"></i> Eliminar Publicación
                                </button>
                            </li>
                        )}
                        <li className="report-item">
                            <button onClick={toggleMenu} className="report-button">
                                <i className="fa-solid fa-x"></i> Cerrar
                            </button>
                        </li>
                    </ul>
                )}
            </div>

            <div className="publicacion">
                {/* <img src={post.imageUrl} alt={post.title} /> */}
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    onClick={showOriginalSize}
                    style={{ maxWidth: "100%", cursor: "pointer" }}
                />

                <div className="publicacion contenido">
                    <div className="descripcion">
                        <div className="reseña">
                            <p>Título: {post.title}</p>
                            <p>Descripción: <br />
                                <span>{post.description}</span>
                            </p>
                            <div style={{ marginTop: '20px' }}>
                                <p>Categoría: {post.category}</p>
                            </div>
                        </div>
                    </div>
                    <div className="reaccion">
                        <p onClick={handleReaction} style={{ cursor: 'pointer' }}>
                            {post.likesCount}
                            {liked ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
                            Me encanta
                        </p>
                        <p>
                            <Link to={`/comments/${post._id}`}>
                                <i className="fa-regular fa-comment"></i>
                                Comentarios
                            </Link>
                        </p>
                    </div>
                    <p style={{ marginLeft: '10px', marginBottom: '5px', fontSize: '12px' }}>{post.date}</p>
                </div>
            </div>

            {/* Dialog para editar publicación */}
            <dialog ref={dialogEditRef} className="dialogPost newpost">
                <h3>Editar Publicación</h3>
                <UpdatePostForm
                    onSubmit={handleSubmitEdit}
                    categorias={categorias}
                    defaultValues={{
                        id: post._id,
                        title: post.title,
                        description: post.description,
                        category: post.category,
                        image: post.imageUrl,
                        user: post.user,
                    }}
                    actionLabel="Actualizar"
                    onCancel={() => closeDialog(dialogEditRef)}
                />
            </dialog>

            {/* Dialog para reportar */}
            <dialog ref={dialogReportRef} className="dialogPost dialogReport">
                <h3>Reportar</h3>
                <ReportForm
                    onSubmit={handleSubmitReport}
                    onCancel={() => closeDialog(dialogReportRef)}
                    opcion='publicacion'
                />
            </dialog>
        </div>
    );
};

Post.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        category: PropTypes.string,
        imageUrl: PropTypes.string.isRequired,
        user: PropTypes.shape({
            id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired
        }).isRequired,
        likesCount: PropTypes.number.isRequired,
        likes: PropTypes.arrayOf(
            PropTypes.shape({
                user: PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    username: PropTypes.string,
                }).isRequired,
                _id: PropTypes.string
            })
        ).isRequired,
        date: PropTypes.string.isRequired,
    }).isRequired,
    onDelete: PropTypes.func,
};

export default Post;
