import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const AdvertisingForm = ({ onSubmit, onCancel }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm({});

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.onerror = () => console.error('Error al leer el archivo');
        reader.readAsDataURL(file);
    };


    const onSubmitForm = (data) => {
        // Pasa los datos y el archivo seleccionado al componente principal
        onSubmit({
            ...data,
            image: selectedFile, // Solo pasar el archivo si fue seleccionado
        });
        resetForm();
        onCancel()
    };

    const resetForm = () => {
        setSelectedFile(null); // Resetea el archivo seleccionado
        setPreview(null); // Restaura la vista previa a su valor inicial
    };

    const handleCancel = () => {
        resetForm();
        if (onCancel) onCancel(); // Llama a la función onCancel si está definida
    };

    return (
        <div className='containerpost'>
            <div className='botones botones2'>
                <button type="submit" style={{ background: '#1d8348' }}>Guardar</button>
                <button type="button" onClick={handleCancel} style={{ background: '#DE2D18' }}>Cancelar</button>
            </div>
            <div className="sub">
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
                    {preview && <img src={preview} alt="Vista previa de la imagen" />}
                </div>
            </div>
            <form className='formPost' onSubmit={handleSubmit(onSubmitForm)}>
                <div>
                    <p>Mostrar hasta:</p>
                    <input
                        type="date"
                        {...register('fechaFin', {
                            required: "El título es requerido",
                            maxLength: { value: 100, message: "Máximo 100 caracteres" }
                        })}
                    />
                    {errors.fechaFin && <span>{errors.fechaFin.message}</span>}
                </div>
                <div>
                    <p>Enlace:</p>
                    <input
                        type='text'
                        {...register('link', {
                            maxLength: { value: 500, message: "Máximo 500 caracteres" }
                        })}
                    />
                    {errors.link && <span>{errors.link.message}</span>}
                </div>
                <div className='botones'>
                    <button type="submit" style={{ background: '#1d8348' }}>Guardar</button>
                    <button type="button" onClick={handleCancel} style={{ background: '#DE2D18' }}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

AdvertisingForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};

export default AdvertisingForm;
