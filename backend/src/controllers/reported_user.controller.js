import ReportedUser from  '../models/reported_user.model';

export const saveReport = async (req, res) => {
    try {
        // Validaciones de entrada
        const { reportId, usuarioReporte, description, usuarioReportado } = req.body;

        if (!reportId) {
            return res.status(400).json({ message: 'El ID del reporte es requerido.' });
        }
        if (!usuarioReporte || !usuarioReporte.userId || !usuarioReporte.nickName) {
            return res.status(400).json({ message: 'Los datos del usuario que reporta son requeridos.' });
        }
        if (!description || description.length > 500) {
            return res.status(400).json({ message: 'La descripción es requerida y no puede exceder 500 caracteres.' });
        }
        if (!usuarioReportado || !usuarioReportado.userId || !usuarioReportado.nickName) {
            return res.status(400).json({ message: 'Los datos del usuario reportado son requeridos.' });
        }

        // Crear nuevo reporte
        const newReport = new ReportedUser({
            reportId,
            usuarioReporte: {
                userId: usuarioReporte.userId,
                nickName: usuarioReporte.nickName
            },
            description,
            usuarioReportado: {
                userId: usuarioReportado.userId,
                nickName: usuarioReportado.nickName
            },
            status: 'Por Verificar'  // Estado inicial predeterminado
        });

        // Guardar el reporte en la base de datos
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
        const { reportId } = req.params;

        if (!reportId) {
            return res.status(400).json({ message: 'El ID del reporte es requerido.' });
        }

        const updatedReport = await ReportedUser.findOneAndUpdate(
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

export const deleteReport = async (req, res) => {
    try {
        const { reportId } = req.params;

        if (!reportId) {
            return res.status(400).json({ message: 'El ID del reporte es requerido.' });
        }

        const deletedReport = await ReportedUser.findOneAndDelete({ reportId });

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