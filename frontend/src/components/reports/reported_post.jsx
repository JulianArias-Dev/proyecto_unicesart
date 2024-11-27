import PropTypes from 'prop-types';
import { Post } from '../components';
import { useReport } from '../../context/context';

const ReportedPost = ({ report }) => {
    const { updatePostReport, deletePostReport, } = useReport();
    const { publicacionAsociada, motivo, _id } = report;

    const handleDelete = async () => {
        await deletePostReport(_id);
    }

    const handleVerificar = async () => {
        await updatePostReport(2, _id);
    }

    return (
        <div className="reportedUser">
            <div className="reported">
                <p>Publicación Reportada:</p>
                <p>Motivo: {motivo}</p>
            </div>
            <div className="report">
                {/* Renderizamos el componente Post con los datos de la publicación asociada */}
                <Post post={publicacionAsociada} />
            </div>
            <div>
                <button onClick={handleDelete} style={{ background: '#1d8348' }}>
                    Eliminar
                </button>
                <button onClick={handleVerificar} style={{ background: '#DE2D18' }}>
                    Verificado
                </button>
            </div>
        </div>
    );
}

// Definimos las PropTypes para asegurar que se pase el reporte correctamente
ReportedPost.propTypes = {
    report: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        publicacionAsociada: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
            category: PropTypes.string,
            imageUrl: PropTypes.string.isRequired,
            user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                username: PropTypes.string.isRequired
            }).isRequired,
            likesCount: PropTypes.number,
            likes: PropTypes.arrayOf(
                PropTypes.shape({
                    user: PropTypes.shape({
                        id: PropTypes.string.isRequired,
                        username: PropTypes.string,
                    }).isRequired,
                    _id: PropTypes.string
                })
            )
        }).isRequired,
        motivo: PropTypes.string.isRequired
    }).isRequired
};

export default ReportedPost;
