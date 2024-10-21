import mongoose from "mongoose";
import { type } from "os";

const reporteSchema = new mongoose.Schema({
    usuarioReporte: {
        id: { type: String, required: true },
        username: { type: String, required: true }
    },
    descripcion: { type: String, required: true },
    motivo: { type: String, required: true },
    usuarioReportado: {
        id: { type: String, required: true },
        username: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['Por Verificar', 'Verificado'],
        default: 'Por Verificar'
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
});

export default mongoose.model('ReportedUser', reporteSchema);
