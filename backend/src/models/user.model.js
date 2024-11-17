import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: 500,
        default: '',
    },
    skills: {
        type: String,
        maxlength: 200,
        default: '',
    },
    profession: {
        type: String,
        maxlength: 100,
        default: '',
    },
    birthDate: {
        type: Date
    },
    lugarOrigen: {
        nombreDepartamento: { type: String },
        nombreMunicipio: { type: String, }
    },
    phone: {
        type: String,
        match: /^\d{7,15}$/,
        unique: true,
        sparse: true,
    },
    gender: {
        type: String,
        enum: ['Masculino', 'Femenino', 'Otro'],
        default: 'Otro'
    },
    lastConnection: {
        type: Date
    }, status: {
        type: String,
        enum: ['Activo', 'Suspendido'],
        default: 'Activo'
    },
    imageUrl: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['usuario', 'administrador'],
        default: 'usuario' // Usuario común 
    },
    recoverCode: {
        type: String,
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
