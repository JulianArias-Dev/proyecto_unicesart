import Ubicacion from '../models/ubicacion.models.js';
import Categoria from '../models/categoria.models.js'

export const getUbicaciones = async (req, res) => {
    try {
        const ubicaciones = await Ubicacion.find();

        if (!ubicaciones || ubicaciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ubicaciones' });
        }

        return res.status(200).json(ubicaciones);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();

        if (!categorias || categorias.length === 0) {
            return res.status.json({ message: error.message });
        }

        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

