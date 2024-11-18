import { useRef, useState } from 'react';
import AdvertisingForm from './advertising_form';
import { usePost } from '../context/context';
import './NewPost.css';

const NewAdd = () => {
    const dialogRef = useRef(null);
    const [textButton, setTextButton] = useState('+');
    const { saveAdd } = usePost();

    const onSubmit = async (data) => {
        try {
            const check = await saveAdd(data);
            if (check) {
                closeDialog();
            }
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
