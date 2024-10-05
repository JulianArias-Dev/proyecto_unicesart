import { useRef, useState } from 'react';
import './NewPost.css';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const NewPost = () => {
    const dialogRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const { user } = useAuth();
    const { categorias, createPost } = usePost();
    const [preview, setPreview] = useState(null);
    const [textButton, setTextButton] = useState('+');
    const [imageUrl, setImageUrl] = useState();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.onerror = () => console.error('Error al leer el archivo');
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data) => {
        if (!selectedFile) {
            alert("Es necesario seleccionar una imagen.");
            return;
        }

        try {
            let imageUploadUrl = imageUrl; // Cambiar a imageUploadUrl

            if (!imageUploadUrl) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("upload_preset", "unicesart_preset");

                // Subir imagen a Cloudinary
                const response = await axios.post('https://api.cloudinary.com/v1_1/dlx1sufu4/image/upload', formData);
                imageUploadUrl = response.data.secure_url; // Guardar la URL de la imagen
                setImageUrl(imageUploadUrl); // Actualizar el estado con la URL de la imagen subida
            }

            // Datos para enviar en la publicación
            const postData = {
                title: data.title,
                description: data.description,
                category: selectedCategory,
                imageUrl: imageUploadUrl, // Usar imageUploadUrl que ya está actualizado
                userId: user.id,
                username: user.username,
            };

            // Enviar publicación al backend
            await createPost(postData);
        } catch (error) {
            console.error("Error al crear la publicación:", error);
            alert("Hubo un error al crear la publicación.");
        }

        closeDialog();
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
                <div className='containerpost'>
                    <div className='botones botones2'>
                        <button type="submit" onClick={handleSubmit(onSubmit)} style={{ background: '#1d8348' }}>Publicar</button>
                        <button type="button" onClick={closeDialog} style={{ background: '#DE2D18' }}>Cancelar</button>
                    </div>
                    <div className='sub'>
                        <div className='imageDiv'>
                            <label htmlFor="fileInput" className="file-link">
                                Seleccionar archivo
                                <input
                                    type="file"
                                    id="fileInput"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </label>
                            {errors.image && <span>{errors.image.message}</span>}
                            {preview && <img src={preview} alt="Vista previa de la imagen" />}
                        </div>
                    </div>

                    <form className='formPost' onSubmit={handleSubmit(onSubmit)}>
                        <p>
                            Título:
                            <input
                                type="text"
                                {...register('title', {
                                    required: "El título es requerido",
                                    maxLength: { value: 100, message: "Máximo 100 caracteres" }
                                })}
                            />
                            {errors.title && <span>{errors.title.message}</span>}
                        </p>
                        <p>
                            Descripción:
                            <textarea
                                {...register('description', {
                                    maxLength: { value: 500, message: "Máximo 500 caracteres" }
                                })}
                            />
                            {errors.description && <span>{errors.description.message}</span>}
                        </p>
                        <p>
                            Categoría:
                            <select
                                className="postCategoria"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
                                <option value="" disabled>Selecciona una categoría</option>
                                {categorias?.map((categoria) => (
                                    <option key={categoria.nombre} value={categoria.nombre}>
                                        {categoria.nombre} - {categoria.description}
                                    </option>
                                ))}
                            </select>
                        </p>
                        <div className='botones'>
                            <button type="submit" style={{ background: '#1d8348' }}>Publicar</button>
                            <button type="button" onClick={closeDialog} style={{ background: '#DE2D18' }}>Cancelar</button>
                        </div>
                    </form>
                </div>

            </dialog>
        </div>
    );
};

export default NewPost;
