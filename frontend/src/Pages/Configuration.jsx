import './Configuration.css';
import { useState } from 'react';
import {CambioContrasena, PersonalInfo, EliminarCuenta, ReportedUser, ReportedPost} from '../Componets/components.jsx';
import { useAuth } from '../context/AuthContext';

const Configuration = () => {
    const [activeOption, setActiveOption] = useState(null);
    const { user } = useAuth();


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
                <button
                    className={`option ${activeOption === 'option1' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('option1')}
                >
                    <p>Cambiar Contraseña</p>
                    {activeOption === 'option1' ?
                        (<i className="fa-solid fa-angle-up"></i>) : (<i className="fa-solid fa-angle-down"></i>)}
                </button>
                {activeOption === 'option1' &&
                    (<div className="deployOption">
                        <CambioContrasena />
                    </div>)}
                {
                    user.role === 'usuario' &&
                    <>
                        <button
                            className={`option ${activeOption === 'option2' ? 'active' : ''}`}
                            onClick={() => handleOptionClick('option2')}
                        >
                            <p>Eliminar Cuenta</p>
                            {activeOption === 'option2' ?
                                (<i className="fa-solid fa-angle-up"></i>) : (<i className="fa-solid fa-angle-down"></i>)}
                        </button>
                        {activeOption === 'option2' &&
                            (<div className="deployOption">
                                <EliminarCuenta />
                            </div>)}
                        <button
                            className={`option ${activeOption === 'option3' ? 'active' : ''}`}
                            onClick={() => handleOptionClick('option3')}
                        >
                            <p>Actualizar Información Personal</p>

                            {activeOption === 'option3' ?
                                (<i className="fa-solid fa-angle-up"></i>) : (<i className="fa-solid fa-angle-down"></i>)}
                        </button>
                        {activeOption === 'option3' &&
                            (<div className="deployOption">
                                <PersonalInfo />
                            </div>)}
                    </>
                }
                {
                    user.role === 'administrador' &&
                    <>
                        <button
                            className={`option ${activeOption === 'option4' ? 'active' : ''}`}
                            onClick={() => handleOptionClick('option4')}
                        >
                            <p>Usuarios Reportados</p>
                            {activeOption === 'option4' ?
                                (<i className="fa-solid fa-angle-up"></i>) : (<i className="fa-solid fa-angle-down"></i>)}
                        </button>
                        {activeOption === 'option5' &&
                            (<div className="deployOption">
                                <ReportedUser />
                                <ReportedUser />
                            </div>)}
                        <button
                            className={`option ${activeOption === 'option5' ? 'active' : ''}`}
                            onClick={() => handleOptionClick('option5')}
                        >
                            <p>Publicaciones Reportadas</p>
                            {activeOption === 'option4' ?
                                (<i className="fa-solid fa-angle-up"></i>) : (<i className="fa-solid fa-angle-down"></i>)}
                        </button>
                        {activeOption === 'option4' &&
                            (<div className="deployOption">
                                <ReportedUser />
                                <ReportedUser />
                            </div>)}
                    </>

                }
            </div>
            <div className="contenido-opcion">
                {activeOption === 'option1' && <CambioContrasena />}
                {activeOption === 'option2' && <EliminarCuenta />}
                {activeOption === 'option3' && <PersonalInfo />}
                {activeOption === 'option4' && <>
                    <ReportedUser />
                </>}
                {activeOption === 'option5' && <>
                    <ReportedPost />
                </>}
            </div>
        </div>
    );
}

export default Configuration;
