import mongoose from "mongoose";
import { type } from "os";

const reporteSchema = new mongoose.Schema({
    reportId: { type: String, required: true, unique: true },
    usuarioReporte: {
        id: { type: String, required: true },
        username: { type: String, required: true }
    },
    description: { type: String, required: true },
    usuarioReportado: {
        id: { type: String, required: true },
        username: { type: String, required: true }
    },
    status: { 
        type: String,
        enum : ['Por Verificar','Verificado'],
        default : 'Por Verificar'
    },
    date : {
        type : Date,
    }
});

export default mongoose.model('ReportedUser', reporteSchema);
