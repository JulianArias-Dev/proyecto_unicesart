import Noticia from '../models/news.models.js'
import cloudinary from 'cloudinary';
import fs from 'fs';

export const saveNew = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'La imagen es requerida.' });
        }

        const { link, fechaFin } = req.body;
        console.log(req.body);
        if (!link) {
            return res.status(400).json({ message: 'Se requiere un enlace para la informacion del evento' });
        }

        if (!fechaFin) {
            return res.status(400).json({ message: 'Se requiere una fecha de finalización para el evento' });
        } else if (fechaFin < Date.now()) {
            return res.status(400).json({ message: 'La fehca de finalización está fuera de rango' });
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            overwrite: true,
        });

        const newAdd = new Noticia({
            imageUrl: uploadResult.secure_url,
            link,
            fechaFin,
        });

        const savedAdd = await newAdd.save();

        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error al eliminar el archivo local:', err);
        });

        return res.status(201).json({
            message: 'Este evento ha sido guardada exitosamente.',
            post: savedAdd,
        });
    } catch (error) {
        console.error('Error al crear el evento:', error);

        return res.status(500).json({
            message: 'Error al crear el evento.',
            error: error.message,
        });
    }
}

export const updateNew = async (req, res) => {
    try {
        const { _id, link, fechaFin } = res.body;
        let { imageUrl } = req.body;

        const addToUpdate = await Noticia.findById(_id);

        if (!addToUpdate) {
            return res.status(400).json({ message: 'No se ha encontrado este evento en la base de datos' });
        }

        if (!link) {
            return res.status(400).json({ message: 'Se requiere un enlace para la informacion del evento' });
        }

        if (!fechaFin) {
            return res.status(400).json({ message: 'Se requiere una fecha de finalización para el evento' });
        } else if (fechaFin < Date.now()) {
            return res.status(400).json({ message: 'La fehca de finalización está fuera de rango' });
        }

        if (!req.file && !imageUrl) {
            return res.status(400).json({ message: 'La imagen es requerida.' });
        }

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                overwrite: true,
            });
            imageUrl = uploadResult.secure_url;
        }

        const updatedAdd = await Noticia.findByIdAndUpdate(
            _id,
            {
                link,
                fechaFin,
                imageUrl : imageUrl,
            },
            { new: true }
        )

        if (updatedAdd) {
            return res.status(200).json({
                message: 'El evento ha sido actualizada exitosamente',                
            });
        }

    } catch (error) {
        console.error('Error al actualizar el evento:', error);

        return res.status(500).json({
            message: 'Error al actualizar el evento.',
            error: error.message,
        });
    }
}

export const deleteAdd = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: 'El ID del evento es requerido.' });
        }

        const addToDelete = await Noticia.findById(id);

        if (!addToDelete) {
            return res.status(404).json({ message: 'Evento no encontrada' });
        }

        await Noticia.findByIdAndDelete(id);

        return res.status(200).json({ message: 'El evento ha sido eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el evento.', error: error.message });
    }
};

export const getAdds = async (req, res) => {
    try {
        const fechaActual = new Date();

        await Noticia.deleteMany({ fechaFin: { $lt: fechaActual } });

        const eventos = await Noticia.find().lean();

        if (!eventos || eventos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron eventos vigentes' });
        }

        return res.status(200).json(eventos);
    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor. Intenta nuevamente más tarde.' });
    }
};
