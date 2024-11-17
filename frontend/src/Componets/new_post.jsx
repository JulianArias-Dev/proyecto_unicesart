import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import PostForm from './post_form';
import './NewPost.css';

const NewPost = () => {
    const dialogRef = useRef(null);
    const { user } = useAuth();
    const { categorias, createPost } = usePost();
    const [textButton, setTextButton] = useState('+');

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);

        // Si hay una imagen seleccionada, agrégala al FormData
        if (data.image) {
            formData.append('image', data.image);
        }

        formData.append('userId', user.id);
        formData.append('username', user.username);

        try {
            closeDialog();
            await createPost(formData);
        } catch (error) {
            console.error("Error al crear la publicación:", error);
            alert("Hubo un error al crear la publicación.");
        }
    };

    const showDialog = () => dialogRef.current?.showModal();
    const closeDialog = () => dialogRef.current?.close();

    const modifyValue = (option) => setTextButton(option === 1 ? 'Nueva Publicación' : '+');

    return (
        <div className="newpost">
            <button
                onClick={showDialog}
                onMouseEnter={() => modifyValue(1)}
                onMouseLeave={() => modifyValue(2)}
                className='floating-button'
            >
                {textButton}
            </button>

            <dialog className='dialogPost' ref={dialogRef}>
                <h3>Nueva Publicación</h3>
                <PostForm
                    onSubmit={onSubmit}
                    categorias={categorias}
                    actionLabel="Publicar"
                    onCancel={closeDialog}
                />
            </dialog>
        </div>
    );
};

export default NewPost;
