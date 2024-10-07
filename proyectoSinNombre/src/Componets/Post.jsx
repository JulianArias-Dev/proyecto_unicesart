import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import './Post.css';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import Swal from 'sweetalert2';

const Post = ({ post }) => {

    const [isOpen, setIsOpen] = useState(false);
    const dialogReportRef = useRef(null);
    const { user, isAuthenticated } = useAuth();
    const { putReaction } = usePost();
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

    const autoResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const openDialog = () => {
        if (!dialogReportRef.current?.open) {
            dialogReportRef.current.showModal();
        }
    };

    const closeDialog = () => {
        if (dialogReportRef.current?.open) {
            dialogReportRef.current.close();
        }
    };


    const handleReport = () => {
        setIsOpen(false);
    };


    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isOpen && !event.target.closest('.report-dropdown')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

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
                        <li className="report-item">
                            <button onClick={openDialog} className="report-button">
                                <i className="fa-solid fa-flag"></i> Contenido inapropiado
                            </button>
                        </li>
                        <li className="report-item">
                            <button onClick={() => handleReport('Spam')} className="report-button">
                                <i className="fa-solid fa-trash"></i> Eliminar Publicación
                            </button>
                        </li>
                        <li className="report-item">
                            <button onClick={() => handleReport('Acoso')} className="report-button">
                                <i className="fa-solid fa-pen"></i> Editar Publicación
                            </button>
                        </li>
                        <li className="report-item">
                            <button onClick={() => handleReport('Otro')} className="report-button">
                                Otro
                            </button>
                        </li>
                        <li className="report-item">
                            <button onClick={toggleMenu} className="report-button">
                                <i className="fa-solid fa-x"></i> Cerrar
                            </button>
                        </li>
                    </ul>
                )}

            </div>

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
                            <textarea name="descripcion" id="descripcion" onChange={autoResize}></textarea>
                        </p>
                    </form>
                </div>

                <div className="botones">
                    <button style={{ background: '#1d8348' }} onClick={closeDialog}>Reportar</button>
                    <button style={{ background: '#DE2D18' }} onClick={closeDialog}>Cancelar</button>
                </div>
            </dialog>

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
