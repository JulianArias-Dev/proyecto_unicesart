import { useEffect } from 'react';
import { useReport } from '../context/report_context';
import { ReportedPost } from '../Componets/components' // Importa el componente ReportedPost para mostrar cada reporte

const Publicaciones = () => {
    const { PostReportCRUD, publicacionesReportadas } = useReport();

    useEffect(() => {
        const data = {
            status: 'Por Verificar',
        }
        PostReportCRUD(4, data);
    }, []);

    return (
        <div className="publicaciones-list">
            {/** Renderiza cada reporte utilizando el componente ReportedPost */}
            {publicacionesReportadas && publicacionesReportadas.length > 0 ? (
                publicacionesReportadas.map((reporte) => (
                    <ReportedPost key={reporte._id} report={reporte} />
                ))
            ) : (
                <p>No hay reportes disponibles.</p> // Mensaje en caso de que no haya reportes
            )}
        </div>
    );
}

export default Publicaciones;
