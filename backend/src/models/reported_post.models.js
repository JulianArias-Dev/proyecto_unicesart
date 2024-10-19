import mongoose from "mongoose";

const reporteSchema = new mongoose.Schema({
    reportId: { type: String, required: true, unique: true },
    usuarioReporte: {
        userId: { type: String, required: true },
        nickName: { type: String, required: true }
    },
    description: { type: String, required: true },
    publicacionReportada: {
        _id: { type: String, required: true },
        title: { type: String, required: true },
        user: {
            userid: { type: String, required: true },
            username: { type: String, required: true },
        }
    },
    status: { 
        type: String,
        enum : ['Por Verificar','Verificado'],
        default : 'Por Verificar'
    }
});

export default mongoose.model('ReportedPost', reporteSchema);
