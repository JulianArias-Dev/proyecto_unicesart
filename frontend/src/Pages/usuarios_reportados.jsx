import { useEffect } from 'react';
import { useReport } from '../context/report_context';
import {ReportedUser} from '../Componets/components';  // Importamos el componente ReportedUser

const Usuarios = () => {
    const { UserReportCRUD, usuariosReportados } = useReport();

    useEffect(() => {
        const data = {
            status: 'Por Verificar',
        }
        UserReportCRUD(4, data);  // Llamamos a la función para obtener los reportes de usuarios
    }, []);

    return (
        <div className="publicaciones-list">
            {usuariosReportados && usuariosReportados.length > 0 ? (
                usuariosReportados.map((reporte) => (
                    <ReportedUser key={reporte._id} report={reporte} />
                ))
            ) : (
                <p>No hay reportes disponibles.</p>  // Mensaje en caso de que no haya reportes
            )}
        </div>
    );
}

export default Usuarios;
