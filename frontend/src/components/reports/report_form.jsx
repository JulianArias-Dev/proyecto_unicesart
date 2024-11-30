import { useState } from "react";
import PropTypes from 'prop-types';

const ReportForm = ({ onSubmit, onCancel, opcion }) => {

    const opcionesUsuario = [
        { id: 'usuario-0', label: 'Acoso o intimidación' },
        { id: 'usuario-1', label: 'Spam' },
        { id: 'usuario-2', label: 'Suplantación de identidad' },
        { id: 'usuario-3', label: 'Contenido inapropiado' },
        { id: 'usuario-4', label: 'Bullying o Ciberacoso' }
    ];
    const opcionesPublicacion = [
        { id: 'publicacion-0', label: 'Contenido Violento' },
        { id: 'publicacion-1', label: 'Contenido Explícito' },
        { id: 'publicacion-2', label: 'Autolesiones' },
        { id: 'publicacion-3', label: 'Spam' },
        { id: 'publicacion-4', label: 'Infracción de derechos de autor' }
    ];

    const [formData, setFormData] = useState({
        motivo: [],
        descripcion: ""
    });

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        setFormData((prevData) => {
            const updatedMotivo = new Set(prevData.motivo);
            if (checked) {
                updatedMotivo.add(value);
            } else {
                updatedMotivo.delete(value);
            }

            return { ...prevData, motivo: [...updatedMotivo] };
        });
    };

    const handleTextareaChange = (e) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            descripcion: value
        }));
    };

    const autoResize = (e) => {
        e.target.style.height = 'auto';  // Reset height
        e.target.style.height = `${e.target.scrollHeight}px`;  // Ajustar al contenido
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const opciones = opcion === "usuario" ? opcionesUsuario : opcionesPublicacion;

    return (
        <form method="dialog" className="formPost">
            <p>Selecciona un motivo:</p>

            {opciones.map((opcion) => (
                <p key={opcion.id}>
                    <input
                        type="checkbox"
                        name="motivo"
                        value={opcion.label}
                        onChange={handleCheckboxChange}
                    />
                    {opcion.label}
                </p>
            ))}

            <p>Descripción: (obligatoria)</p>
            <textarea
                name="descripcion"
                id="descripcion"
                onChange={handleTextareaChange}
                onInput={autoResize}
            ></textarea>

            <div className="botones2">
                <button style={{ background: '#1d8348' }} onClick={handleSubmit}>Reportar</button>
                <button style={{ background: '#DE2D18' }} onClick={onCancel}>Cancelar</button>
            </div>
            <div className="botones">
                <button style={{ background: '#1d8348' }} onClick={handleSubmit}>Reportar</button>
                <button style={{ background: '#DE2D18' }} onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    );
};

ReportForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    opcion: PropTypes.oneOf(['usuario', 'publicacion']).isRequired
};

export default ReportForm;
