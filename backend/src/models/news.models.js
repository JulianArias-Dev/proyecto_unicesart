import mongoose from "mongoose";

const noticiaSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    descripcion: { type: String, required: true },
    fechaFin: { type: Date, required: true }
});

export default mongoose.model('Noticia', noticiaSchema);
