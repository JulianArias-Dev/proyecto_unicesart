import User from '../models/user.model.js';
import Post from '../models/post.models.js';
import { z } from 'zod'
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { createAccesToken } from '../libs/jwt.js';

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

const formatFecha = (fechaISO) => {
    const dateObj = new Date(fechaISO);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
};

export const register = async (req, res) => {
    try {
        const { email, username, fullName, gender, password, role } = req.body;

        //Validar que los campos hayan sido enviados 
        if (!email) {
            return res.status(400).json({ message: 'El correo electrónico es requerido.' });
        }

        if (!password) {
            return res.status(400).json({ message: 'La contraseña es requerida.' });
        }

        if (!username) {
            return res.status(400).json({ message: 'El nombre de usuario es requerido.' });
        }

        if (!fullName) {
            return res.status(400).json({ message: 'El nombre completo es requerido.' });
        }

        if (!gender) {
            return res.status(400).json({ message: 'El genero es requerido.' });
        }

        //Validar que no existan usuarios con el mismo correo electrónico o nombre de usuario
        const userFoundByEmail = await User.findOne({ email }).lean().exec();
        const userFoundByUsername = await User.findOne({ username }).lean().exec();

        if (userFoundByEmail || userFoundByUsername) {
            return res.status(400).json({
                message: 'Errores en el registro',
                errors: [
                    userFoundByEmail ? 'La dirección de correo electrónico ya está en uso.' : null,
                    userFoundByUsername ? 'El nombre de usuario ya está en uso.' : null,
                ].filter(Boolean),
            });
        }

        //Encriptar la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        //Guardar usuario en la base de datos
        const newUser = new User({
            email,
            password: passwordHash,
            username,
            fullName,
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

        //Buscar usuario en la base de datos
        const userFound = await User.findOne({ email }).lean().exec();

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
    const { email, fullName, description, skills, profession, birthDate, city, phone, gender, } = req.body;
    const imageUrl = '';

    try {
        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        userFound.fullName = fullName ?? userFound.fullName;
        userFound.description = description ?? userFound.description;
        userFound.skills = skills ?? userFound.skills;
        userFound.profession = profession ?? userFound.profession;
        userFound.lugarOrigen = {
            nombreDepartamento: city?.departamento ?? userFound.lugarOrigen.nombreDepartamento,
            nombreMunicipio: city?.municipio ?? userFound.lugarOrigen.nombreMunicipio,
        };
        userFound.birthDate = birthDate ?? userFound.birthDate;
        userFound.phone = phone ?? userFound.phone;
        userFound.gender = gender ?? userFound.gender;
        userFound.imageUrl = imageUrl ?? userFound.imageUrl;

        const updatedUser = await userFound.save();

        return res.json({
            id: updatedUser._id,
            email: updatedUser.email,
            username: updatedUser.username,
            fullName: updatedUser.fullName,
            description: updatedUser.description,
            skills: updatedUser.skills,
            profession: updatedUser.profession,
            lugarOrigen: {
                nombreDepartamento: updatedUser.lugarOrigen.nombreDepartamento,
                nombreMunicipio: updatedUser.lugarOrigen.nombreMunicipio,
            },
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
        res.status(500).json({ message: error.message });
    }
};

export const profile = async (req, res) => {
    try {
        const { id } = req.query;

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
            user = await User.findOne({ email });
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
            user = await User.findOne({ email });
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
        await Post.deleteMany({ "user.id": userId });

        // 3. Eliminar los likes del usuario en publicaciones ajenas
        await Post.updateMany(
            { "likes.user.id": userId }, // Condición para encontrar publicaciones con sus likes
            { $pull: { likes: { "user.id": userId } } } // Remover los likes de ese usuario
        );

        // 4. Eliminar al usuario
        await User.findByIdAndDelete(userId);

        return res.status(200).json({ message: 'Cuenta eliminada correctamente, publicaciones y likes eliminados.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar la cuenta.' });
    }
};

export const suspendUser = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: 'Se requiere la id del usuario.' });
        }

        const user = await User.findById({ _id });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.status = user.status === "Suspendido" ? "Activo" : "Suspendido";

        await Post.updateMany(
            {
                "user.id": _id,
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

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { fullName: { $regex: query, $options: "i" } }
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