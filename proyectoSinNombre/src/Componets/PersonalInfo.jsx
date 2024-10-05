import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const PersonalInfo = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [isEditable, setIsEditable] = useState(false);
    const [selectedDepartamento, setSelectedDepartamento] = useState('');
    const { user, ubicaciones, getUbicaciones, updateUser } = useAuth(); // Asumiendo que tienes esta función en el contexto

    useEffect(() => {
        if (!Array.isArray(ubicaciones)) {
            getUbicaciones();
        }
        if (user) {
            setValue('fullName', user.fullName);
            setValue('birthDate', user.birthDate?.substring(0, 10));
            setValue('gender', user.gender);
            setValue('city.departamento', user.lugarOrigen?.nombreDepartamento);
            setValue('city.municipio', user.lugarOrigen?.nombreMunicipio);
            setValue('profession', user.profession);
            setValue('skills', user.skills);
            setValue('description', user.description);
            setValue('phone', user.phone);
            setValue('email', user.email);
        }
    }, [user, ubicaciones, setValue]);

    const handleEdit = () => {
        setIsEditable(true);
    };

    const handleSave = (data) => {
        updateUser(data); // Lógica para actualizar la información en el backend
        setIsEditable(false);
    };
    
    const convertDateToISO = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };


    const departamentos = Array.isArray(ubicaciones) ? ubicaciones : [];
    const municipios = selectedDepartamento
        ? departamentos.find((ubicacion) => ubicacion.nombre === selectedDepartamento)?.municipios || []
        : [];

    return (
        <section className="informacionPersonal">
            <form onSubmit={handleSubmit(handleSave)}>
                <p>Nombre</p>
                <input
                    type="text"
                    disabled={!isEditable}
                    {...register("fullName", { required: "Nombre es requerido" })}
                />
                {errors.fullName && <span>{errors.fullName.message}</span>}

                <p>Fecha Nacimiento</p>
                <input
                    type="date"
                    disabled={!isEditable}
                    defaultValue={user?.birthDate ? convertDateToISO(user.birthDate) : ''}
                    {...register("birthDate", { required: "Fecha de nacimiento es requerida" })}
                />

                {errors.birthDate && <span>{errors.birthDate.message}</span>}


                <p>Género</p>
                <select
                    disabled={!isEditable}
                    {...register("gender", { required: "Género es requerido" })}
                >
                    <option value={user?.gender ?? ''} disabled selected>{user?.gender ?? 'Selecciona tu género'}</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Prefiero no decirlo</option>
                </select>
                {errors.gender && <span>{errors.gender.message}</span>}

                <p>Ciudad de Origen</p>
                <p>Departamento</p>
                {departamentos.length > 0 && (
                    <>
                        <select
                            {...register("city.departamento", { required: "El departamento es requerido" })}
                            value={selectedDepartamento}
                            onChange={(e) => setSelectedDepartamento(e.target.value)}
                            disabled={!isEditable}
                        >
                            <option value={user?.lugarOrigen?.nombreDepartamento ?? ''} disabled>{user?.lugarOrigen?.nombreDepartamento ?? 'Selecciona un Departamento'}</option>
                            {departamentos.map((ubicacion) => (
                                <option key={ubicacion.departamentoId} value={ubicacion.nombre}>
                                    {ubicacion.nombre}
                                </option>
                            ))}
                        </select>

                        <p>Municipio</p>
                        <select
                            {...register("city.municipio", { required: "El municipio es requerido" })}
                            disabled={!isEditable}
                        >
                            <option value={user?.lugarOrigen?.nombreMunicipio ?? ''} disabled>{user?.lugarOrigen?.nombreMunicipio ?? 'Selecciona un Municipio'}</option>
                            {municipios.map((municipio) => (
                                <option key={municipio.id} value={municipio.nombreMunicipio}>
                                    {municipio.nombreMunicipio}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <p>Carrera</p>
                <input
                    type="text"
                    disabled={!isEditable}
                    {...register("profession")}
                />

                <p>Habilidades</p>
                <textarea
                    disabled={!isEditable}
                    {...register("skills")}
                ></textarea>

                <p>Descripción</p>
                <textarea
                    disabled={!isEditable}
                    {...register("description")}
                ></textarea>

                <p>Teléfono</p>
                <input
                    type="text"
                    disabled={!isEditable}
                    {...register("phone")}
                />

                <p>Email</p>
                <input
                    type="text"
                    disabled={!isEditable}
                    {...register("email")}
                />
                <div>
                    <button type="button" onClick={handleEdit} disabled={isEditable}>Editar</button>
                    <button type="submit" disabled={!isEditable}>Guardar</button>
                </div>
            </form>
        </section>
    );
};

export default PersonalInfo;
