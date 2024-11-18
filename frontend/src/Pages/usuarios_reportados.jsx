import { useEffect, useState } from 'react';
import { useReport } from '../context/context';
import {ReportedUser} from '../Componets/components';  // Importamos el componente ReportedUser

const Usuarios = () => {
    const { UserReportCRUD, usuariosReportados } = useReport();

    const categorias = ['Todas', 'Por Verificar', 'Verificado'];
    const [selectedCategory, setSelectedCategory] = useState('');
    const handleCategoryChange = (category) => {
        setSelectedCategory(category); // Actualiza la categoría seleccionada directamente
    };

    useEffect(() => {
        const data = {
            status: 'Por Verificar',
        }
        UserReportCRUD(4, data);  // Llamamos a la función para obtener los reportes de usuarios
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
