import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import './Post.css';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import Swal from 'sweetalert2';
import PostForm from './PostForm'; // Asegúrate de importar PostForm

const Post = ({ post }) => {

    const [isOpen, setIsOpen] = useState(false);
    const dialogEditRef = useRef(null); // Ref para el dialog de edición
    const dialogReportRef = useRef(null);
    const { user, isAuthenticated, } = useAuth();
    const { putReaction, deletePost, categorias, updatePost } = usePost(); // Asumiendo que tienes deletePost y updatePost
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
        setIsOpen(false); // Cerramos el menú de opciones
        openDialog(dialogEditRef); // Abrimos el dialog para edición
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
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    const handleSubmitEdit = async (data) => {
        console.log(data);
        const formData = new FormData();
        formData.append('id', data.id);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('image', data.image);
        formData.append('userid', data.user.id);
        formData.append('username', data.user.username);

        try {
            const check = await updatePost(formData);
            if (check) {
                closeDialog(dialogEditRef);
            }
        } catch (error) {
            console.error("Error al modificar la publicación:", error);
            alert("Hubo un error al modificar la publicación.");
        }
    };

    return (
        <div className="post">
            <div className="post-top">
                <div className="userInfo">
                    <i className="fa-solid fa-user"></i>
                    <p><Link to={`/profile/${post.user.username}`}>{post.user.username}</Link></p>
                </div>
                {
                    isAuthenticated &&
                    <div className="report-dropdown">
                        <button className="report-button" onClick={toggleMenu}>
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                    </div>
                }
                {isOpen && (
                    <ul className="report-menu">

                        {post.user.id === user.id ?
                            (
                                <>
                                    <li className="report-item">
                                        <button onClick={handleDelete} className="report-button">
                                            <i className="fa-solid fa-trash"></i> Eliminar Publicación
                                        </button>
                                    </li>
                                    <li className="report-item">
                                        <button onClick={handleEdit} className="report-button">
                                            <i className="fa-solid fa-pen"></i> Editar Publicación
                                        </button>
                                    </li>
                                </>
                            ) :
                            (
                                <li className="report-item">
                                    <button onClick={() => openDialog(dialogReportRef)} className="report-button">
                                        <i className="fa-solid fa-flag"></i> Contenido inapropiado
                                    </button>
                                </li>
                            )
                        }
                        <li className="report-item">
                            <button onClick={toggleMenu} className="report-button">
                                <i className="fa-solid fa-x"></i> Cerrar
                            </button>
                        </li>
                    </ul>
                )}
            </div>

            <div className="publicacion">
                <img src={post.imageUrl} alt={post.title} />
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
                    <div onClick={handleReaction} style={{ cursor: 'pointer' }} className="reaccion">
                        <p>
                            <span>{post.likesCount}</span>
                            {liked ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
                            <span>Me encanta</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Dialog para editar publicación */}
            <dialog ref={dialogEditRef} className="dialogPost newpost">
                <h3>Editar Publicación</h3>
                <PostForm
                    onSubmit={handleSubmitEdit}
                    categorias={categorias} // Aquí deberías pasar tus categorías reales
                    defaultValues={{
                        id: post._id,
                        title: post.title,
                        description: post.description,
                        category: post.category,
                        image: post.imageUrl,
                        user: post.user,
                    }}
                    actionLabel="Actualizar"
                    onCancel={() => closeDialog(dialogEditRef)} // Cerrar el diálogo al cancelar
                />
            </dialog>

            {/* Dialog para reportar */}
            <dialog ref={dialogReportRef} className="dialogPost dialogReport">
                <h3>Reportar</h3>
                <div className="sub">
                    <form method="dialog" className="formPost">
                        <p>Selecciona un motivo:</p>
                        <p>
                            <input type="checkbox" name="motivo" value="spam" />
                            Spam
                        </p>
                        <p>
                            <input type="checkbox" name="motivo" value="contenido_inapropiado" />
                            Contenido inapropiado
                        </p>
                        <p>
                            <input type="checkbox" name="motivo" value="acoso" />
                            Acoso
                        </p>
                        <p>
                            <input type="checkbox" name="motivo" value="otro" />
                            Otro
                        </p>
                        <p>
                            <label>Descripción (Opcional):</label>
                            <textarea name="descripcion" id="descripcion" onChange={e => e.target.style.height = 'auto'}></textarea>
                        </p>
                    </form>
                </div>

                <div className="botones">
                    <button style={{ background: '#1d8348' }} onClick={() => closeDialog(dialogReportRef)}>Reportar</button>
                    <button style={{ background: '#DE2D18' }} onClick={() => closeDialog(dialogReportRef)}>Cancelar</button>
                </div>
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
    }).isRequired,
};

export default Post;
