import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const PostForm = ({ onSubmit, categorias, onCancel }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({});
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        console.log(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.onerror = () => console.error('Error al leer el archivo');
        reader.readAsDataURL(file);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const onSubmitForm = (data) => {
        // Pasa los datos y el archivo seleccionado al componente principal
        onSubmit({
            ...data,
            category: selectedCategory,
            image: selectedFile, // Solo pasar el archivo si fue seleccionado
        });
        resetForm();
    };

    const resetForm = () => {
        reset(); // Resetea los campos del formulario
        setSelectedFile(null);
        setPreview(null);
        setSelectedCategory('');
    };

    const handleCancel = () => {
        resetForm();
        if (onCancel) onCancel(); // Llama a la función onCancel si está definida
    };

    return (
        <div className='containerpost'>
            <div className='botones botones2'>
                <button type="submit" style={{ background: '#1d8348' }}>Publicar</button>
                <button type="button" onClick={handleCancel} style={{ background: '#DE2D18' }}>Cancelar</button>
            </div>
            <div className="sub">
                <div className='imageDiv'>
                    <label htmlFor="fileInput" className="file-link">
                        Seleccionar archivo{' '}
                        <input
                            type="file"
                            id="fileInput"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </label>
                    {preview && <img src={preview} alt="Vista previa de la imagen" />}
                </div>
            </div>
            <form className='formPost' onSubmit={handleSubmit(onSubmitForm)}>
                <div>
                    <p>Título:</p>
                    <input
                        type="text"
                        {...register('title', {
                            required: "El título es requerido",
                            maxLength: { value: 30, message: "Máximo 30 caracteres" },
                            minLength: {value:10, message:"Se necesitan al menos 10 caracteres"},
                        })}
                    />
                    {errors.title && <span>{errors.title.message}</span>}
                </div>
                <div>
                    <p>Descripción:</p>
                    <textarea
                        {...register('description', {
                            maxLength: { value: 400, message: "Máximo 400 caracteres" }
                        })}
                    />
                    {errors.description && <span>{errors.description.message}</span>}
                </div>
                <div>
                    <p>Categoría:</p>
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
                </div>

                <div className='botones'>
                    <button type="submit" style={{ background: '#1d8348' }}>Publicar</button>
                    <button type="button" onClick={handleCancel} style={{ background: '#DE2D18' }}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

PostForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    categorias: PropTypes.arrayOf(
        PropTypes.shape({
            nombre: PropTypes.string.isRequired,
            description: PropTypes.string,
        })
    ).isRequired,
    actionLabel: PropTypes.string,
    onCancel: PropTypes.func,
};

export default PostForm;
