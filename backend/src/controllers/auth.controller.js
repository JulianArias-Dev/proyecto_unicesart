import User from '../models/user.model.js';
import Post from '../models/post.models.js';
import { createAccesToken } from '../libs/jwt.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { z } from 'zod'
import { formatFecha } from './shared_funtions.js';
import { validateRegisterInput, updateUserFields, sanitizeInputFields } from './validators.js';

const calcularEdad = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }

    return age;
};

export const register = async (req, res) => {
    try {
        const { email, username, fullName, gender, password, role } = req.body;

        // Validar los campos de entrada
        const validationError = validateRegisterInput({ email, username, fullName, gender, password });
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // Sanitizar los datos 
        const sanitizedEmail = validator.normalizeEmail(email);
        const sanitizedUsername = validator.escape(username);
        const sanitizedFullName = validator.escape(fullName);

        //Validar que no existan usuarios con el mismo correo electrónico o nombre de usuario
        const userFoundByEmail = await User.findOne({ email: sanitizedEmail }).lean().exec();
        const userFoundByUsername = await User.findOne({ username: sanitizedUsername }).lean().exec();

        if (userFoundByEmail || userFoundByUsername) {
            const errorMessages = [
                userFoundByEmail ? 'La dirección de correo electrónico ya está en uso.' : null,
                userFoundByUsername ? 'El nombre de usuario ya está en uso.' : null,
            ].filter(Boolean).join(' '); // Concatena los mensajes con un espacio.
        
            return res.status(400).json({
                message: 'Errores en el registro: ' + errorMessages, // Mensaje concatenado.
            });
        }
        

        //Encriptar la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        //Guardar usuario en la base de datos
        const newUser = new User({
            email: sanitizedEmail,
            password: passwordHash,
            username: sanitizedUsername,
            fullName: sanitizedFullName,
            gender,
            role: role ?? 'usuario',
        });

        const savedUser = await newUser.save();

        //Validar que el usuario se haya guardado
        if (!savedUser) {
            return res.status(500).json({ message: 'Ha ocurrido un error al registrar el nuevo Usuario.' });
        }

        //Generar token de validación
        const token = await createAccesToken({ id: savedUser._id });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 día
        });

        //Enviar reespuesta
        return res.status(200).json({
            id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username,
            fullName: savedUser.fullName,
            gender: savedUser.gender,
            status: savedUser.status,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt,
            role: savedUser.role,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Errores de validación',
                errors: error.errors.map((err) => err.message),
            });
        }

        res.status(500).json({
            message: 'Error del servidor',
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Validar que los campos hayan sido enviados
        if (!email) {
            return res.status(400).json({ message: 'El correo electrónico es requerido.' });
        }

        if (!password) {
            return res.status(400).json({ message: 'La contraseña es requerida.' });
        }

        const sanitizedEmail = validator.normalizeEmail(email);

        //Buscar usuario en la base de datos
        const userFound = await User.findOne({ email: sanitizedEmail }).lean().exec();

        if (!userFound) {
            return res.status(400).json({
                message: "Usuario no encontrado",
            });
        }

        //Validar estado del usuario
        if (userFound.status === "Suspendido") {
            return res.status(400).json({
                message: "El usuario se encuentra suspendido por infringir las politicas de la página. ",
            });
        }

        //Validar contraseña
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Contraseña incorrecta",
            });
        }

        //Crear token de validación
        const token = await createAccesToken({ id: userFound._id });

        //devolver respuesta y token de validación
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 día
        });

        res.json({
            id: userFound._id,
            email: userFound.email,
            username: userFound.username,
            fullName: userFound.fullName,
            description: userFound.description,
            skills: userFound.skills,
            profession: userFound.profession,
            lugarOrigen: {
                nombreDepartamento: userFound.lugarOrigen?.nombreDepartamento,
                nombreMunicipio: userFound.lugarOrigen?.nombreMunicipio,
            },
            birthDate: userFound.birthDate,
            phone: userFound.phone,
            gender: userFound.gender,
            status: userFound.status,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            imageUrl: userFound.imageUrl,
            edad: calcularEdad(userFound.birthDate),
            role: userFound.role,
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                errors: error.errors.map((err) => err.message),
            });
        }

        res.status(500).json({
            message: 'Error del servidor',
            error: error.message,
        });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    return res.status(200).json({ message: "Sesión cerrada con éxito." });
};

export const updateUser = async (req, res) => {
    try {
        const { email, fullName, description, skills, profession, birthDate, city, phone, gender } = req.body;

        // Sanitize input fields
        const sanitizedData = sanitizeInputFields({
            email,
            fullName,
            description,
            skills,
            profession,
            phone,
        });

        // Find user by sanitized email
        const userFound = await User.findOne({ email: sanitizedData.email });
        if (!userFound) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Update user fields
        updateUserFields(userFound, {
            ...sanitizedData,
            birthDate,
            city,
            gender,
        });

        const updatedUser = await userFound.save();

        return res.json({
            id: updatedUser._id,
            email: updatedUser.email,
            username: updatedUser.username,
            fullName: updatedUser.fullName,
            description: updatedUser.description,
            skills: updatedUser.skills,
            profession: updatedUser.profession,
            lugarOrigen: updatedUser.lugarOrigen,
            birthDate: updatedUser.birthDate,
            phone: updatedUser.phone,
            gender: updatedUser.gender,
            status: updatedUser.status,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
            imageUrl: updatedUser.imageUrl,
            edad: calcularEdad(updatedUser.birthDate),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const profile = async (req, res) => {
    try {
        const { id } = req.query;

        // Validar que 'id' sea un ObjectId válido
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de usuario no válido.' });
        }

        const userFound = await User.findById(id);

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({
            id: userFound._id,
            email: userFound.email,
            username: userFound.username,
            fullName: userFound.fullName,
            description: userFound.description,
            skills: userFound.skills,
            profession: userFound.profession,
            lugarOrigen: {
                nombreDepartamento: userFound.lugarOrigen.nombreDepartamento,
                nombreMunicipio: userFound.lugarOrigen.nombreMunicipio
            },
            birthDate: formatFecha(userFound.birthDate),
            phone: userFound.phone,
            gender: userFound.gender,
            status: userFound.status,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            imageUrl: userFound.imageUrl,
            edad: calcularEdad(userFound.birthDate),
            role: userFound.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePassword = async (req, res) => {
    const { userId, password, newPassword, email } = req.body;
    let user;
    try {
        if (email) {
            const sanitizedEmail = validator.normalizeEmail(email);
            user = await User.findOne({ email:sanitizedEmail });
            if (!user) {
                return res.status(404).json({ message: 'El email parece no estar registrado' });
            }
        } else {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'ID de usuario no válido.' });
            }

            user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
            }
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.password = passwordHash;
        await user.save();

        return res.status(200).json({
            message: 'La contraseña ha sido actualizada exitosamente.',
            cambio: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const setCode = async (req, res) => {
    const { userId, password, email } = req.body;

    try {
        let user;
        if (email) {
            const sanitizedEmail = validator.normalizeEmail(email);
            user = await User.findOne({ email:sanitizedEmail });
            if (!user) {
                return res.status(404).json({ message: 'El email parece no estar registrado' });
            }

        } else {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'ID de usuario no válido.' });
            }

            user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
            }
        }

        const recoverCode = generarCodigoAleatorio(8);
        user.recoverCode = recoverCode;
        await user.save();

        return res.status(200).json({
            isValid: true,
            recoverCode: user.recoverCode,
        });

    } catch (error) {
        console.error('Error en al validar el Codigo:', error);
        return res.status(500).json({ message: 'Error del servidor. Intenta nuevamente más tarde.' });
    }
};

export const dropAccount = async (req, res) => {
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID de usuario no válido.' });
    }

    try {
        const user = await User.findById(userId);

        // 1. Buscar el usuario
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 2. Eliminar todas las publicaciones del usuario
        await Post.deleteMany({ "user.id": user._id });

        // 3. Eliminar los likes del usuario en publicaciones ajenas
        await Post.updateMany(
            { "likes.user.id": user._id }, // Condición para encontrar publicaciones con sus likes
            { $pull: { likes: { "user.id": user._id } } } // Remover los likes de ese usuario
        );

        // 4. Eliminar al usuario
        await User.findByIdAndDelete(user._id);

        return res.status(200).json({ message: 'Cuenta eliminada correctamente, publicaciones y likes eliminados.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar la cuenta.' });
    }
};

export const suspendUser = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Se requiere una id de usuario valida' });
        }

        const user = await User.findById({ _id });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.status = user.status === "Suspendido" ? "Activo" : "Suspendido";

        await Post.updateMany(
            {
                "user.id": user._id,
                status: { $in: ["Suspendido", "Normal"] }  // Filtra solo los estados que queremos alternar
            },
            [
                {
                    $set: {
                        status: {
                            $cond: {
                                if: { $eq: ["$status", "Suspendido"] },
                                then: "Normal",
                                else: "Suspendido"
                            }
                        }
                    }
                }
            ]
        );

        const updatedUser = await user.save();

        return res.status(200).json({ message: 'Se ha actualizado el estado del usuario', user: updatedUser });

    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor. Intenta nuevamente más tarde.' });
    }
}

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Se requiere un palabra clave para la búsqueda' });
        }

        const sanitizedQuery = validator.escape(query);

        const users = await User.find({
            $or: [
                { username: { $regex:sanitizedQuery, $options: "i" } },
                { fullName: { $regex: sanitizedQuery, $options: "i" } }
            ]
        })
            .select("username fullName birthDate _id") // Campos del usuario
            .populate("lugarOrigen", "nombreMunicipio"); // Subcampo de la referencia

        if (users.length <= 0) {
            return res.status(404).json({ message: 'No se han encontrado similares' });
        }

        // Agregar el campo "edad" a cada usuario encontrado
        const usersWithAge = users.map(user => {
            const age = calcularEdad(user.birthDate);
            return { ...user._doc, edad: age }; // Utilizar "_doc" para acceder al documento original
        });

        return res.status(200).json(usersWithAge);

    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor. Intenta nuevamente más tarde.' });
    }
};

function generarCodigoAleatorio(longitud = 8) {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%&';
    let codigo = '';

    for (let i = 0; i < longitud; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[randomIndex];
    }

    return codigo;
}