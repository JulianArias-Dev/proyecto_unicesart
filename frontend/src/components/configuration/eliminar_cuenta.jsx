import {  useState } from "react";
import { useAuth } from '../../context/context';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const EliminarCuenta = () => {

    const API = 'http://localhost:4000/api';
    const [step, setStep] = useState(1);
    const [buttonText, setButtonText] = useState('Enviar Codigo de Verificación');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const { user, deleteAccount } = useAuth();
    const navigate = useNavigate();

    const handleButtonClick = async () => {
        if (step === 1) {
            try {
                const userId = user.id;
                const res = await axios.put(`${API}/set-recover-code`, { userId, password }, { withCredentials: true });

                const { isValid, recoverCode } = res.data;
                if (isValid) {
                    setTimeout(() => {
                        if (recoverCode) {
                            Swal.fire({
                                title: "Código generado",
                                text: `Su código de verificación es: ${recoverCode}`,
                                icon: "info",
                            });

                            // Avanza al siguiente paso: ingreso del código de verificación
                            user.recoverCode = recoverCode;
                            setStep(2);
                            setButtonText('Confirmar Código');
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: "No se pudo generar el código de verificación. Inténtelo de nuevo.",
                                icon: "error",
                            });
                        }
                    }, 500);

                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Contraseña incorrecta. Por favor, inténtelo nuevamente.",
                        icon: "error",
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: "Error",
                    text: "Error al validar la contraseña. Intente de nuevo.",
                    icon: "error",
                });
            }
        } else if (step === 2) {
            if (code === user.recoverCode) {
                Swal.fire({
                    title: "Código confirmado",
                    text: "El código ha sido verificado correctamente.",
                    icon: "success",
                });

                setStep(3);
                setButtonText('Eliminar Cuenta');
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Código incorrecto. Por favor, inténtelo nuevamente.",
                    icon: "error",
                });
            }
        } else if (step === 3) {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción eliminará permanentemente tu cuenta y todos tus datos. ¿Quieres continuar?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar cuenta",
                cancelButtonText: "Cancelar",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const userId = user.id;
                        await deleteAccount(userId);

                        Swal.fire({
                            title: "Cuenta eliminada",
                            text: "Tu cuenta ha sido eliminada correctamente.",
                            icon: "success",
                        });

                        setTimeout(() => {
                            navigate('/');
                        }, 500);
                    } catch (error) {
                        console.error(error);
                        Swal.fire({
                            title: "Error",
                            text: "Error al eliminar la cuenta. Inténtelo más tarde.",
                            icon: "error",
                        });
                    }
                }
            });
        }
    };


    return (
        <div className="cambioContrasena">
            <div style={{ background: '#f1948a', width: '98%', margin: 'auto' }}>
                <p>Al eliminar la cuenta se borrarán todos sus datos, incluyendo publicaciones y reacciones.</p>
                <p>¿Está seguro de que desea eliminar su cuenta?</p>
            </div>

            {step === 1 && (
                <>
                    <p>Ingrese por favor su contraseña:</p>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                    />
                </>
            )}

            {step === 2 && (
                <>
                    <section style={{ marginTop: '2%', padding: 'auto' }}>
                        <p>Ingrese el código de verificación enviado:</p>
                        <input
                            type="text"
                            name="verification-code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Código de verificación"
                        />
                    </section>
                    <button onClick={(e) => {
                        e.preventDefault();
                        navigate('/home')
                    }}
                        style={{ background: 'red' }}>
                        Cancelar
                    </button>
                </>
            )}

            <button onClick={handleButtonClick}>{buttonText}</button>
        </div>
    );
};

export default EliminarCuenta;
