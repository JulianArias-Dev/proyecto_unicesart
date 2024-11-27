import { useRef, useState } from 'react';
import AdvertisingForm from './create_add_form';
import { usePost } from '../../context/context';
import '../post/NewPost.css';

const NewAdd = () => {
    const dialogRef = useRef(null);
    const [textButton, setTextButton] = useState('+');
    const { saveAdd } = usePost();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('link', data.link);
        formData.append('fechaFin', data.fechaFin);
    
        // Si hay una imagen seleccionada, agrégala al FormData
        if (data.image) {
            formData.append('image', data.image);
        }
    
        try {
            closeDialog();
            await saveAdd(formData);
        } catch (error) {
            console.error("Error al crear el anuncio:", error);
            alert("Hubo un error al crear el anuncio.");
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
                <AdvertisingForm
                    onSubmit={onSubmit}
                    actionLabel="Publicar"
                    onCancel={closeDialog}
                />
            </dialog>
        </div>
    );
};

export default NewAdd;
