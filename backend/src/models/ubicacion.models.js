import mongoose from "mongoose";

const municipioSchema = new mongoose.Schema({
    id: { type: String, required: true },
    nombreMunicipio: { type: String, required: true }
});

const ubicacionSchema = new mongoose.Schema({
    departamentoId: { type: String, required: true },
    nombre: { type: String, required: true },
    municipios: [municipioSchema]
});

export default mongoose.model('Ubicacion', ubicacionSchema);
