import { useState } from 'react';
import './Login.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

const RecuperarContraseña = () => {
    const [sendMail, setSendMail] = useState(false);
    const [buttonContent, setButtonContent] = useState('Solicitar código');
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); 
        if (!sendMail) {
            MySwal.fire({
                title: "Código de Recuperación",
                text: "Se ha enviado un código de recuperación a la dirección de correo electrónico.",
                icon: "success"
            });
            setSendMail(true);
            setButtonContent('Verificar Código');
        } else {
            MySwal.fire({
                title: "Verificando Código",
                text: "El código ha sido verificado con éxito.",
                icon: "success"
            });
            navigate('/home');
        }
    };

    const handleResendCode = () => {
        MySwal.fire({
            title: "Código Reenviado",
            text: "Se ha reenviado el código de recuperación a su correo electrónico.",
            icon: "success"
        });
    };

    return (
        <div className="container recuperacion">
            <form className="formulario" onSubmit={handleSubmit}>
                <div className="field">
                    <i className="fa-solid fa-user"></i>
                    <input
                        type="email"
                        placeholder="Correo Electrónico"
                        required
                    />
                </div>
                {
                    sendMail &&
                    (
                        <>
                            <div className="field">
                                <i className="fa-solid fa-hashtag"></i>
                                <input
                                    type="password"
                                    placeholder="Código de Confirmación"
                                    required
                                />
                            </div>
                            <div className="field">
                                <button type="submit">{buttonContent}</button>
                                <button type="button" onClick={handleResendCode}>Reenviar Código</button>
                            </div>
                        </>
                    )
                }
                {
                    !sendMail &&
                    (
                        <div className="field">
                            <button type="submit">{buttonContent}</button>
                        </div>
                    )
                }
            </form>
        </div>
    );
}

export default RecuperarContraseña;
