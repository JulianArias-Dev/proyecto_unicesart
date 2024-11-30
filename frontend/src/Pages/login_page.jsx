import './Login.css';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from '../context/context';
import { useEffect } from 'react';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { isAuthenticated, errors: registerErrors, signIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate('/home');
    }, [isAuthenticated, navigate]);

    const handleLogin = async (data) => {
        signIn(data);
    };

    return (
        <div className="Father">
            <div className="imagenFondo">
                <img src="src/assets/street-art-7888561_1920.jpg" alt="" />
                <div className="dialogo">
                    <div className="container">
                        {/* Mostrar errores de autenticación */}
                        {registerErrors && registerErrors.length > 0 && (
                            <div className="error-container">
                                {registerErrors.map((error) => (
                                    <span key={error.id || error.message || error.toString()} className="error-message">
                                        {error.message || error.toString()}
                                    </span>
                                ))}
                            </div>
                        )}

                        <form className="formulario" onSubmit={handleSubmit(handleLogin)}>
                            <h3 className='form-title'>Inicio de Sesión</h3>
                            <div className="field">
                                <i className="fa-solid fa-user"></i>
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Correo electrónico es requerido",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@unicesar\.edu\.co$/,
                                            message: "El correo debe ser del dominio @unicesar.edu.co"
                                        }
                                    })}
                                    placeholder="Correo Electrónico"
                                />
                                {errors.email && <span className="error-message">{errors.email.message}</span>}
                            </div>
                            <div className="field">
                                <i className="fa-solid fa-key"></i>
                                <input
                                    type="password"
                                    {...register("password", {
                                        required: "Contraseña es requerida",
                                        pattern: {
                                            value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?<>])[A-Za-z\d!@#$%^&*()_\-+=?<>]{8,}$/,
                                            message: "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial.",
                                        },
                                    })}
                                    placeholder="Contraseña"
                                />
                                {errors.password && <span className="error-message">{errors.password.message}</span>}
                            </div>

                            <div className="field">
                                <a style={{ margin: 'auto', color: '#000' }} href="/recover">¿Olvidó su Contraseña?</a>
                            </div>
                            <div className="field">
                                <button type="submit">Iniciar Sesión</button>
                                <button className="sinGoogle">Iniciar Sesión con <img src="src/assets/google.png" alt="Google" /></button>
                            </div>
                        </form>
                    </div>
                    <div className="contribucion">
                        <p>Imagen de <a href="https://pixabay.com/es/users/tho-ge-113537/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7888561">Thomas G.</a> en <a href="https://pixabay.com/es//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7888561">Pixabay</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
