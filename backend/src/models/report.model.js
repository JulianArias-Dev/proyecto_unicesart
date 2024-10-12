import mongoose from "mongoose";

const reporteSchema = new mongoose.Schema({
    reportId: { type: String, required: true, unique: true },
    usuarioReporte: {
        userId: { type: String, required: true },
        nickName: { type: String, required: true }
    },
    description: { type: String, required: true },
    usuarioReportado: {
        userId: { type: String, required: true },
        nickName: { type: String, required: true }
    },
    status: { type: String }
});

export default mongoose.model('Reporte', reporteSchema);
