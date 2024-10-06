import { useState } from 'react';
import './Login.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import { validateRequest, recoverPasswordRequest } from '../API/auth';

const RecuperarContraseña = () => {
    const [sendMail, setSendMail] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [buttonContent, setButtonContent] = useState('Solicitar código');
    const [code, setCode] = useState();
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!sendMail) {
            try {
                console.log(email);
                const res = await validateRequest(null, null, email);

                const { isValid, recoverCode } = res.data;
                if (isValid) {

                    setTimeout(() => {
                        if (recoverCode) {
                            Swal.fire({
                                title: "Código generado",
                                text: `Su código de verificación es: ${recoverCode}`,
                                icon: "info",
                            });
                            setCode(recoverCode);
                            setSendMail(true);
                            setButtonContent('Verificar Código');
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: "No se pudo generar el código de verificación. Inténtelo de nuevo.",
                                icon: "error",
                            });
                        }
                    }, 500)
                }
            } catch (error) {
                MySwal.fire({
                    title: "Error",
                    text: "No se pudo enviar el código de recuperación. Inténtelo más tarde.",
                    icon: "error"
                });
            }
        } else if (!codeVerified) {
            try {
                if (verificationCode === code) {
                    MySwal.fire({
                        title: "Verificando Código",
                        text: "El código ha sido verificado con éxito.",
                        icon: "success"
                    });
                    setCodeVerified(true);
                    setButtonContent('Cambiar Contraseña');
                } else {
                    MySwal.fire({
                        title: "Error",
                        text: "El código ingresado es incorrecto.",
                        icon: "error"
                    });
                }
            } catch (error) {
                MySwal.fire({
                    title: "Error",
                    text: "Error al verificar el código. Inténtelo de nuevo.",
                    icon: "error"
                });
            }
        } else {
            try {
                const res = await recoverPasswordRequest(newPassword, email);

                if (res.status === 200) {
                    MySwal.fire({
                        title: "Contraseña Actualizada",
                        text: "Su contraseña ha sido actualizada con éxito.",
                        icon: "success"
                    });
                    navigate('/singin');
                } else {
                    MySwal.fire({
                        title: "Error al actualizar contraseña",
                        text: "Su contraseña no ha sido actualizada.",
                        icon: "error"
                    });
                }
            } catch (error) {
                MySwal.fire({
                    title: "Error",
                    text: "Error al actualizar la contraseña. Inténtelo de nuevo.",
                    icon: "error"
                });
            }
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={sendMail}
                    />
                </div>
                {
                    sendMail && !codeVerified && (
                        <div className="field">
                            <i className="fa-solid fa-hashtag"></i>
                            <input
                                type="text"
                                placeholder="Código de Confirmación"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                        </div>
                    )
                }
                {
                    codeVerified && (
                        <div className="field">
                            <i className="fa-solid fa-lock"></i>
                            <input
                                type="password"
                                placeholder="Nueva Contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                    )
                }
                <div className="field">
                    <button type="submit">{buttonContent}</button>
                    {sendMail && !codeVerified && (
                        <button type="button" onClick={handleResendCode}>Reenviar Código</button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default RecuperarContraseña;
