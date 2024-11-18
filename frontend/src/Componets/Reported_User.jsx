import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useReport } from '../context/context';
import './report.css';

const ReportedUser = ({ report }) => {
    const { user } = useAuth();
    const [userLink, setUserLink] = useState('');
    const navigate = useNavigate();
    const { deleteUserReport, updateUserReport } = useReport();
    const { _id } = report

    useEffect(() => {
        setUserLink(user?.id);
    }, [user, setUserLink]);

    const navegar = (e) => {
        e.preventDefault();
        navigate(`/profile/${userLink}`);
    }

    // Verificamos si el `report` está definido antes de intentar acceder a sus propiedades
    if (!report || !report.usuarioReportado) {
        return <div>No se puede mostrar el reporte. Faltan datos.</div>;
    }

    const handleDelete = async () => {
        await deleteUserReport(_id);
    }

    const handleVerificar = async () => {
        await updateUserReport(2, _id);
    }

    return (
        <div className="reportedUser">
            <div className="reported">
                <div>
                    <p>Usuario Reportado:</p>
                    <button onClick={navegar}>{report.usuarioReportado.username}</button>
                </div>
            </div>
            <div className="report">
                <p>Motivo: {report.motivo}</p>
                <p>Descripción: {report.descripcion}</p>
            </div>
            <div>
                <button
                    style={{ background: '#1d8348' }}
                    onClick={handleDelete}
                >
                    Eliminar
                </button>
                <button
                    style={{ background: '#DE2D18' }}
                    onClick={handleVerificar}
                >
                    Verificado
                </button>
            </div>
        </div>
    );
};

// Definimos los PropTypes para el componente ReportedUser
ReportedUser.propTypes = {
    _id: PropTypes.string.isRequired,
    report: PropTypes.shape({
        usuarioReportado: PropTypes.shape({
            id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired
        }),
        motivo: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
    }),
};

export default ReportedUser;