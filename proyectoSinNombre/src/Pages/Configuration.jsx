import './Configuration.css';
import { useState } from 'react';
import CambioContrasena from '../Componets/CambioContrasena';
import PersonalInfo from '../Componets/PersonalInfo';
import EliminarCuenta from '../Componets/EliminarCuenta';

const Configuration = () => {
    const [activeOption, setActiveOption] = useState(null);

    const handleOptionClick = (option) => {
        if (option == activeOption) {
            setActiveOption(null);
        } else {
            setActiveOption(option);
        }

    };

    return (
        <div className="configuration">
            <div className="options">
                <div
                    className={`option ${activeOption === 'option1' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('option1')}
                >
                    <p>Cambiar Contraseña</p>
                    {activeOption === 'option1' ?
                        (<i className="fa-solid fa-angle-up"></i>) : (<i className="fa-solid fa-angle-down"></i>)}
                </div>
                {activeOption === 'option1' &&
                    (<div className="deployOption">
                        <CambioContrasena />
                    </div>)}
                <div
                    className={`option ${activeOption === 'option2' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('option2')}
                >
                    <p>Eliminar Cuenta</p>

                    {activeOption === 'option2' ?
                        (<i className="fa-solid fa-angle-up"></i>) : (<i className="fa-solid fa-angle-down"></i>)}
                </div>
                {activeOption === 'option2' &&
                    (<div className="deployOption">
                        <EliminarCuenta />
                    </div>)}
                <div
                    className={`option ${activeOption === 'option3' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('option3')}
                >
                    <p>Actualizar Información Personal</p>

                    {activeOption === 'option3' ?
                        (<i className="fa-solid fa-angle-up"></i>) : (<i className="fa-solid fa-angle-down"></i>)}
                </div>
                {activeOption === 'option3' &&
                    (<div className="deployOption">
                        <PersonalInfo />
                    </div>)}
                <div
                    className={`option ${activeOption === 'option4' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('option4')}
                >
                    <p>Reportes</p>
                    {activeOption === 'option4' ?
                        (<i className="fa-solid fa-angle-up"></i>) : (<i className="fa-solid fa-angle-down"></i>)}
                </div>
                {activeOption === 'option4' &&
                    (<div className="deployOption">
                        <h1>Reportes</h1>
                    </div>)}
            </div>
            <div className="contenido-opcion">
                {activeOption === 'option1' && <CambioContrasena />}
                {activeOption === 'option2' && <EliminarCuenta />}
                {activeOption === 'option3' && <PersonalInfo />}
                {activeOption === 'option4' && <h1>Opcion 4</h1>}
            </div>
        </div>
    );
}

export default Configuration;
