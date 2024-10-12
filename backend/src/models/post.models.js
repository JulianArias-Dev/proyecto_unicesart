import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        unique: true
    },
    description: { 
        type: String, 
    },
    category: { 
        type: String, 
        required: true 
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    user: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, required: true }
    },
    likes: [{
        user: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
            username: { type: String, }
        }
    }],
    date: { type: Date, default: Date.now, required: true },
    status: {
        type: String,
        enum: ['Normal', 'Reportado', 'Verificación'],
        default: 'Normal',
    }
});

export default mongoose.model('Post', postSchema);