import './Login.css';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/context';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { singUp, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate('/home');
    }, [isAuthenticated, navigate]);

    const handleRegister = async (data) => {
        singUp(data);
    };


    return (
        <div className="Father">
            <div className="imagenFondo">
                <img src="src/assets/street-art-7888561_1920.jpg" alt="" />
                <div className="dialogo">
                    <div className="container">
                        {registerErrors.length > 0 && (
                            <div className="error-container">
                                {registerErrors.map((error, index) => (
                                    <span key={index}>{error}</span>
                                ))}
                            </div>
                        )}
                        <form className="formulario formularioRegister" onSubmit={handleSubmit(handleRegister)}>
                            <div className='camposRegister'>
                                <div className="field campo">
                                    <i className="fa-solid fa-user"></i>
                                    <input
                                        type="text"
                                        placeholder='Nombres y Apellidos'
                                        {...register("fullName", {
                                            required: "Nombres y Apellidos son requeridos",
                                            pattern: {
                                                value: /^[a-zA-Z\s]+$/,
                                                message: "Solo se permiten letras y espacios"
                                            },
                                            minLength: {
                                                value: 3,
                                                message: "Debe tener al menos 3 caracteres"
                                            }
                                        })}
                                    />
                                    {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
                                </div>

                                <div className="field campo">
                                    <i className="fa-solid fa-at"></i>
                                    <input
                                        type="text"
                                        {...register("username", {
                                            required: "Nombre de usuario es requerido",
                                            minLength: {
                                                value: 3,
                                                message: "El nombre de usuario debe tener al menos 3 caracteres"
                                            },
                                            maxLength: {
                                                value: 15,
                                                message: "El nombre de usuario no puede exceder los 15 caracteres"
                                            }
                                        })}
                                        placeholder='Nombre de Usuario'
                                    />
                                    {errors.username && <span className="error-message">{errors.username.message}</span>}
                                </div>
                                <div className="field campo">
                                    <div>
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
                                    </div>
                                    <div>
                                        <i className="fa-solid fa-lock"></i>
                                        <input
                                            type="password"
                                            {...register("password", {
                                                required: "Contraseña es requerida",
                                                minLength: {
                                                    value: 8,
                                                    message: "La contraseña debe tener al menos 8 caracteres"
                                                },
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                    message: "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
                                                }
                                            })}
                                            placeholder="Contraseña"
                                        />
                                    </div>
                                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                                    {errors.password && <span className="error-message">{errors.password.message}</span>}
                                </div>
                                <div className="field campo">
                                    <i className="fa-solid fa-venus-mars"></i>
                                    <select {...register("gender", { required: "Género es requerido" })} defaultValue="">
                                        <option value="" disabled>Género</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="Otro">Prefiero no decirlo</option>
                                    </select>
                                    {errors.gender && <span className="error-message">{errors.gender.message}</span>}
                                </div>
                            </div>
                            <div className="field campo">
                                <button type="submit">Registrarse</button>
                                <button className="sinGoogle">Registrarse con<img src="src/assets/google.png" alt="" /></button>
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

export default Register;