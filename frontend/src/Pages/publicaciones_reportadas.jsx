import './DashBoard.css'
import { useEffect, useState } from 'react';
import { useReport } from '../context/context';
import { ReportedPost } from '../Componets/components' // Importa el componente ReportedPost para mostrar cada reporte

const Publicaciones = () => {
    const { fetchPostReports, publicacionesReportadas } = useReport();

    const categorias = ['Todas', 'Por Verificar', 'Verificado'];
    const [selectedCategory, setSelectedCategory] = useState('');
    const handleCategoryChange = (category) => {
        setSelectedCategory(category); // Actualiza la categoría seleccionada directamente
    };

    useEffect(() => {
        const data = {
            status: 'Por Verificar',
        }
        fetchPostReports(data);
    }, []);

    return (
        <div className="publicaciones-list">
            <div className="categoriaBotones">
                {/* Botón para seleccionar "Todas" las categorías */}
                {categorias?.map((categoria) => (
                    <button
                        key={categoria}
                        className={`categoriaBoton ${selectedCategory === categoria ? 'seleccionado' : ''}`}
                        onClick={() => handleCategoryChange(categoria)}
                    >
                        {categoria}
                    </button>
                ))}
            </div>
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
