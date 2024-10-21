import mongoose from "mongoose";

const reporteSchema = new mongoose.Schema({
    usuarioReporte: {
        id: { type: String, required: true },
        username: { type: String, required: true }
    },
    descripcion: { type: String, required: true },
    motivo : { type: String, required: true },
    publicacionReportada: {
        id: { type: String, required: true },        
    },
    status: { 
        type: String,
        enum : ['Por Verificar','Verificado'],
        default : 'Por Verificar'
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
});

export default mongoose.model('ReportedPost', reporteSchema);
