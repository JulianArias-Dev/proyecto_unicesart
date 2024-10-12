import mongoose from "mongoose";

const noticiaSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    descripcion: { type: String, required: true },
    fecha: { type: Date, required: true }
});

export default mongoose.model('Noticia', noticiaSchema);
