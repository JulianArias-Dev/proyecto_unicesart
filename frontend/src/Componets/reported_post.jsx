import PropTypes from 'prop-types';
import { Post } from './components';

const ReportedPost = ({ report }) => {
    const { publicacionAsociada, motivo } = report;

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
                <button style={{ background: '#1d8348' }}>
                    Eliminar
                </button>
                <button style={{ background: '#DE2D18' }}>
                    Verificado
                </button>
            </div>
        </div>
    );
}

// Definimos las PropTypes para asegurar que se pase el reporte correctamente
ReportedPost.propTypes = {
    report: PropTypes.shape({
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
