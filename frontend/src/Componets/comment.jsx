import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { usePost } from '../context/PostContext';

const Comment = ({ comment, postUser, onDelete }) => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [editable, setEditable] = useState(false);
    const { deleteComment, updateComment } = usePost();
    const [newComment, setNewComment] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        setContent(comment.content);
    }, [setContent, comment.content]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteComment(comment._id);
    
                    onDelete(comment._id);
    
                    Swal.fire(
                        'Eliminado',
                        'El comentario ha sido eliminado.',
                        'success'
                    );
                } catch (error) {
                    console.error("Error al eliminar el comentario:", error);
                    Swal.fire(
                        'Error',
                        'Hubo un problema al eliminar el comentario.',
                        'error'
                    );
                }
            }
        });
    };

    const handleTextareaChange = (e) => {
        const value = e.target.value;
        if (value.length <= 100) {
            setNewComment(value);
        }
    };

    const handleEdit = async () => {
        try {
            // Validación de `newComment` para asegurar que no esté vacío o nulo
            if (!newComment || newComment.trim() === "") {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Comentario vacío',
                    text: 'El comentario no puede estar vacío.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const data = await updateComment({
                content: newComment,
                _id: comment._id
            });

            setContent(data.newContent);
            setEditable(false);
        } catch (error) {
            console.error("Error al guardar el comentario:", error);
        }
    }


    const enableEdit = (e) => {
        e.preventDefault();
        setEditable(true);
        setIsOpen(false);
    }

    return (
        <div className="comment">
            <div className="userInfo">
                <i className="fa-solid fa-user"></i>
                <p><Link to={`/profile/${comment.user.id}`}>{comment.user.username}</Link></p>
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

                        {(comment.user.id === user.id) && (
                            <li className="report-item">
                                <button onClick={enableEdit} className="report-button">
                                    <i className="fa-solid fa-pen"></i> Editar Publicación
                                </button>
                            </li>
                        )
                        }
                        {
                            (user.role === "administrador" || user.id === postUser || comment.user.id === user.id) &&
                            <li className="report-item">
                                <button onClick={handleDelete} className="report-button">
                                    <i className="fa-solid fa-trash"></i> Eliminar Comentario
                                </button>
                            </li>
                        }
                        <li className="report-item">
                            <button onClick={toggleMenu} className="report-button">
                                <i className="fa-solid fa-x"></i> Cerrar
                            </button>
                        </li>
                    </ul>
                )}
            </div>
            {
                !editable ?
                    (<p>{content}</p>)
                    :
                    (
                        <div className='editable-comment'>
                            <textarea
                                defaultValue={content}
                                onChange={handleTextareaChange}
                                maxLength="100">
                            </textarea>
                            <div>
                                <button style={{ background: '#1d8348' }} onClick={handleEdit} >Guardar</button>
                                <button style={{ background: '#DE2D18' }} onClick={() => { setEditable(false) }} >Cancelar</button>
                            </div>
                        </div>
                    )
            }


        </div>
    );
}

Comment.propTypes = {
    comment: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        user: PropTypes.shape({
            id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
        }),
        postId: PropTypes.string.isRequired,
    }).isRequired,
    postUser: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default Comment;

