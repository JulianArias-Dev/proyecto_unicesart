import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true },
    nombre: { type: String, required: true },
    description: { type: String }
});

export default mongoose.model('Categoria', categorySchema);