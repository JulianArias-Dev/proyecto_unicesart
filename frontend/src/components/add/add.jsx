import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAuth, usePost } from '../../context/context';
import Swal from 'sweetalert2';

const Advertising = ({ add, onDelete }) => {

    const [buttons, setButtons] = useState(false);
    const { user } = useAuth();
    const { deleteAdd } = usePost();

    const enableButtons = () => {
        if (user.role === "administrador") {
            setButtons(!buttons);
        }
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
                </div>}
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