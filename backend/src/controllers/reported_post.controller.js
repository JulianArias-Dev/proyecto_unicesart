import ReportedPost from  '../models/reported_post.models.js';
import User from '../models/user.model.js';
import Post from '../models/post.models.js';

export const saveReportPost = async (req, res) => {
    try {
        const { usuarioReporte, descripcion, motivo, publicacionReportada } = req.body;

        if (!usuarioReporte || !usuarioReporte.id || !usuarioReporte.username) {
            return res.status(400).json({ message: 'Los datos del usuario que reporta son requeridos.' });
        }
        if (!descripcion || descripcion.length > 500) {
            return res.status(400).json({ message: 'La descripción es requerida y no puede exceder 500 caracteres.' });
        }
        if (!motivo || motivo.length === 0) {
            return res.status(400).json({ message: 'Debe proporcionar al menos un motivo para el reporte.' });
        }
        if (!publicacionReportada || !publicacionReportada.id ) {
            return res.status(400).json({ message: 'Los datos del usuario reportado son requeridos.' });
        }

        const userReporting = await User.findById(usuarioReporte.id);
        const postReported = await Post.findById(publicacionReportada.id);

        if (!userReporting) {
            return res.status(404).json({ message: 'El usuario que reporta no existe.' });
        }

        if (!postReported) {
            return res.status(404).json({ message: 'La publicación no existe.' });
        }

        const newReport = new ReportedPost({
            usuarioReporte: {
                id: userReporting._id,
                username: userReporting.username,
            },
            descripcion,
            motivo,
            publicacionReportada: {
                id: publicacionReportada.id, 
            },
        });

        const savedReport = await newReport.save();

        return res.status(201).json({
            message: 'El reporte ha sido guardado exitosamente.',
            report: savedReport,
        });
    } catch (error) {
        console.error('Error al crear el reporte:', error);

        return res.status(500).json({
            message: 'Error al crear el reporte.',
            error: error.message,
        });
    }
};

export const updateReportPost = async (req, res) => {
    try {
        const { reportId } = req.params;

        if (!reportId) {
            return res.status(400).json({ message: 'El ID del reporte es requerido.' });
        }

        const updatedReport = await ReportedPost.findOneAndUpdate(
            { reportId },
            { status: 'Verificado' },
            { new: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ message: 'Reporte no encontrado.' });
        }

        return res.status(200).json({
            message: 'Reporte actualizado a Verificado exitosamente.',
            report: updatedReport
        });
    } catch (error) {
        console.error('Error al actualizar el reporte:', error);

        return res.status(500).json({
            message: 'Error al actualizar el reporte.',
            error: error.message
        });
    }
};

export const deleteReportPost = async (req, res) => {
    try {
        const { reportId } = req.params;

        if (!reportId) {
            return res.status(400).json({ message: 'El ID del reporte es requerido.' });
        }

        const deletedReport = await ReportedPost.findOneAndDelete({ reportId });

        if (!deletedReport) {
            return res.status(404).json({ message: 'Reporte no encontrado.' });
        }

        return res.status(200).json({
            message: 'Reporte eliminado exitosamente.',
            report: deletedReport
        });
    } catch (error) {
        console.error('Error al eliminar el reporte:', error);

        return res.status(500).json({
            message: 'Error al eliminar el reporte.',
            error: error.message
        });
    }
};

export const getReportsPost = async (req, res) => {
    try {
        const { status } = req.query;

        const query = {};
        if (status) {
            query.status = status;
        }

        const reports = await ReportedPost.find(query);

        return res.status(200).json({
            message: 'Reportes obtenidos exitosamente.',
            reports
        });
    } catch (error) {
        console.error('Error al obtener los reportes:', error);

        return res.status(500).json({
            message: 'Error al obtener los reportes.',
            error: error.message
        });
    }
};
