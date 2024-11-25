import './comments.css';
import { Comment, Post } from '../Componets/components.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePost, useAuth } from '../context/context.jsx';
import Swal from 'sweetalert2';

const CommentPage = () => {
    const { postid } = useParams();
    const { fetchComments, saveComment, setPublicaciones } = usePost();
    const [currentPost, setCurrentPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useAuth()
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const data = await fetchComments(postid);
                setCurrentPost(data.post);
                setComments(data.comments);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };
        fetchComment();
    }, [postid, fetchComments]);

    const handleTextareaChange = (e) => {
        const value = e.target.value;
        if (value.length <= 100) {
            setNewComment(value);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!newComment || newComment.trim() === "") {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Comentario vacío',
                    text: 'El comentario no puede estar vacío.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const data = await saveComment({
                content: newComment,
                userid: user.id,
                username: user.username,
                postId: postid,
            });

            if (data) {
                setComments([...comments, data.comment]);
                setNewComment('');  // Limpiar el campo de entrada
            }
        } catch (error) {
            console.error("Error al guardar el comentario:", error);
        }
    };

    const handleDeleteComment = (commentId) => {
        setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    };

    const handleDeletePost = (postId) => {
        navigate('/home');
        setPublicaciones((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    };

    return (
        <div className="commentpage">
            <i onClick={goBack} className="fa-solid fa-arrow-left"></i>
            <div className='currentpost'>
                {/* Verificamos que post tenga la estructura esperada antes de renderizar */}
                {currentPost && currentPost._id ? (
                    <Post key={currentPost._id} post={currentPost} onDelete={handleDeletePost}/>
                ) : (
                    <p>Cargando...</p>
                )}
            </div>
            <div className="comments">
                {(comments?.length > 0) ? (
                    comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            postUser={currentPost.user.id}
                            onDelete={handleDeleteComment}  // Pasar la función como prop
                        />
                    ))
                ) : (
                    <p className='comment'>No hay comentarios disponibles.</p>
                )}
            </div>
            <div className="newComment">
                <textarea
                    placeholder='Comentario...'
                    value={newComment}
                    onChange={handleTextareaChange}
                    maxLength="100"
                ></textarea>
                <button onClick={handleSubmit}>
                    <i className="fa-regular fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
}

export default CommentPage;
