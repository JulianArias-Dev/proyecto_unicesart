export function validateRegisterInput({ email, username, fullName, gender, password }) {
    if (!email) return 'El correo electrónico es requerido.';
    if (!password) return 'La contraseña es requerida.';
    if (!username) return 'El nombre de usuario es requerido.';
    if (!fullName) return 'El nombre completo es requerido.';
    if (!gender) return 'El género es requerido.';
    return null;
}

export function sanitizeInputFields({ email, fullName, description, skills, profession, phone }) {
    return {
        email: email ? validator.normalizeEmail(email) : null,
        fullName: fullName ? validator.escape(fullName) : null,
        description: description ? validator.escape(description) : null,
        skills: skills ? validator.escape(skills) : null,
        profession: profession ? validator.escape(profession) : null,
        phone: phone ? validator.escape(phone) : null,
    };
}

export function updateUserFields(user, { email, fullName, description, skills, profession, birthDate, city, phone, gender }) {
    user.fullName = fullName ?? user.fullName;
    user.description = description ?? user.description;
    user.skills = skills ?? user.skills;
    user.profession = profession ?? user.profession;
    user.lugarOrigen = {
        nombreDepartamento: city?.departamento ?? user.lugarOrigen.nombreDepartamento,
        nombreMunicipio: city?.municipio ?? user.lugarOrigen.nombreMunicipio,
    };
    user.birthDate = birthDate ?? user.birthDate;
    user.phone = phone ?? user.phone;
    user.gender = gender ?? user.gender;
}
