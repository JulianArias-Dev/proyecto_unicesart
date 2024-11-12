import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: {
        id: { type: String, required: true },
        username: { type: String, required: true },
    },
    postId: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    status: {
        type: String,
        enum: ['Normal', 'Reportado', 'Verificación'],
        default: 'Normal',
    }
});

export default mongoose.model('Comment', CommentSchema);