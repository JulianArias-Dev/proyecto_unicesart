import ReportedUser from '../models/reported_user.model.js';
import User from '../models/user.model.js';

export const saveReport = async (req, res) => {
    try {
        console.log(req.body);
        const { usuarioReporte, descripcion, motivo, usuarioReportado } = req.body;

        if (!usuarioReporte?.id || !usuarioReporte.username) {
            return res.status(400).json({ message: 'Los datos del usuario que reporta son requeridos.' });
        }
        if (!descripcion || descripcion.length > 500) {
            return res.status(400).json({ message: 'La descripción es requerida y no puede exceder 500 caracteres.' });
        }
        if (!motivo || motivo.length === 0) {
            return res.status(400).json({ message: 'Debe proporcionar al menos un motivo para el reporte.' });
        }
        if (!usuarioReportado?.id || !usuarioReportado.username) {
            return res.status(400).json({ message: 'Los datos del usuario reportado son requeridos.' });
        }

        const userReporting = await User.findById(usuarioReporte.id);
        const userReported = await User.findById(usuarioReportado.id);

        if (!userReporting) {
            return res.status(404).json({ message: 'El usuario que reporta no existe.' });
        }

        if (!userReported) {
            return res.status(404).json({ message: 'El usuario reportado no existe.' });
        }

        const newReport = new ReportedUser({
            usuarioReporte: {
                id: userReporting._id,
                username: userReporting.username,
            },
            descripcion,
            motivo,
            usuarioReportado: {
                id: userReported._id,
                username: userReported.username,
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

export const updateReport = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: 'El ID del reporte es requerido.' });
        }

        const updatedReport = await ReportedUser.findOneAndUpdate(
            { _id },
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

export const deleteReport = async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id) {
            return res.status(400).json({ message: 'El ID del reporte es requerido.' });
        }

        const deletedReport = await ReportedUser.findOneAndDelete({ _id });

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

export const getReports = async (req, res) => {
    try {
        const { status } = req.query;

        const query = {};
        if (status) {
            query.status = status;
        }

        const reports = await ReportedUser.find(query);

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