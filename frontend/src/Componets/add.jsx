import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useAuth, usePost } from '../context/context';
import Swal from 'sweetalert2';
import AdvertisingForm from './advertising_form';

const Advertising = ({ add, onDelete, onUpdate }) => {

    const [buttons, setButtons] = useState(false);
    const dialogEditRef = useRef(null);
    const { user } = useAuth();
    const { deleteAdd } = usePost();

    const enableButtons = () => {
        if (user.role === "administrador") {
            setButtons(!buttons);
        }
    }

    const handleUpdate = async () => {
        onUpdate();
    }

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
                    await deleteAdd(add._id);

                    onDelete(add._id);
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

    const handleEdit = () => {
        //setIsOpen(false);
        openDialog(dialogEditRef);
    }

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

    return (
        <div className="add" onMouseEnter={enableButtons} onMouseLeave={enableButtons}>
            <img src={add.imageUrl} alt="noticia" />
            <span>
                <a href={add.link}>
                    Más información
                </a>
            </span>
            {buttons &&
                <div className="buttonsAdd">
                    <button onClick={handleDelete} style={{ background: '#DE2D18' }}><i className="fa-solid fa-trash"></i></button>
                    <button onClick={handleEdit} style={{ background: '#1d8348' }}><i className="fa-solid fa-pen"></i></button>
                </div>}

            {/* Dialog para editar publicación */}
            <dialog ref={dialogEditRef} className="dialogPost newpost">
                <h3>Editar Publicación</h3>
                <AdvertisingForm
                    onSubmit={handleUpdate}
                    defaultValues={{
                        _id: add._id,
                        link: add.link,
                        imageUrl: add.imageUrl,
                        fechaFin: add.fechaFin,
                    }}
                    actionLabel="Actualizar"
                    onCancel={() => closeDialog(dialogEditRef)}
                />
            </dialog>
        </div>
    );
}

Advertising.propTypes = {
    add: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        fechaFin: PropTypes.string.isRequired, 
    }).isRequired,    
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
}

export default Advertising;