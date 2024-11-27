import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/context';
import Swal from 'sweetalert2';

const CambioContrasena = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { user, updatePassword } = useAuth();

    const newPassword = watch('newPassword', '');

    const handleButtonClick = async (data) => {
        try {
            const { password, newPassword } = data;
            const userId = user.id;

            Swal.fire({
                title: "¿Estás seguro?",
                text: "¿Deseas cambiar tu contraseña?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, cambiar contraseña"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await updatePassword({userId, password, newPassword});
                }
            });
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema con la solicitud. Inténtalo más tarde.",
                icon: "error"
            });
        }
    };


    return (
        <div className="cambioContrasena">
            <form onSubmit={handleSubmit(handleButtonClick)}>
                <p>Contraseña Actual</p>
                <input
                    type="password"
                    {...register("password", {
                        required: "La contraseña actual es requerida",
                    })}
                    placeholder="Contraseña actual"
                />
                {errors.password && <span>{errors.password.message}</span>}

                <p>Nueva Contraseña</p>
                <input
                    type="password"
                    {...register("newPassword", {
                        required: "La nueva contraseña es requerida",
                        minLength: {
                            value: 8,
                            message: "La contraseña debe tener al menos 8 caracteres"
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
                        }
                    })}
                    placeholder="Nueva contraseña"
                />
                {errors.newPassword && <span>{errors.newPassword.message}</span>}

                <p>Confirmar Nueva Contraseña</p>
                <input
                    type="password"
                    {...register("confirmPassword", {
                        required: "Por favor confirma la nueva contraseña",
                        validate: value =>
                            value === newPassword || "Las contraseñas no coinciden"
                    })}
                    placeholder="Confirmar nueva contraseña"
                />
                {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

                <button type="submit">Cambiar Contraseña</button>
            </form>
        </div>
    );
};

export default CambioContrasena;
