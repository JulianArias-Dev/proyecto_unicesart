import Comment from "../models/comment.models.js";
import Post from '../models/post.models.js'
import mongoose from "mongoose";

export const getComments = async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id) {
            return res.status(400).json({ message: 'El Id de la publicación es requerido.' });
        }

        const post = await Post.findById(_id);

        if (!post) {
            return res.status(404).json({ message: 'No se ha encontrado la publicación.' });
        }

        const responsePost = {
            ...post.toObject(),
            likesCount: post.likes ? post.likes.length : 0
        };

        const comentarios = await Comment.find({
            postId: _id  // Convierte _id a ObjectId si es necesario
        }).lean();

        res.status(200).json({ post: responsePost, comments: comentarios });

    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor. Intenta nuevamente más tarde.' });
    }
}

export const saveComment = async (req, res) => {
    try {

        const { content, postId, userid, username } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'El contenido es requerido.' });
        }

        if (!postId) {
            return res.status(400).json({ message: 'El Id de la publicación es requerido.' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'No se ha encontrado la publicación.' });
        }

        if (!userid) {
            return res.status(400).json({ message: 'El Id del usuario es requerido.' });
        }

        if (!username) {
            return res.status(400).json({ message: 'El nombre de usuario es requerido.' });
        }

        const newComment = new Comment({
            content,
            user: {
                id: userid,
                username
            },
            postId
        });

        const savedComment = await newComment.save();

        return res.status(201).json({
            message: 'El comentario ha sido guardado exitosamente.',
            comment: savedComment,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor. Intenta nuevamente más tarde.' });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id) {
            return res.status(400).json({ message: 'El Id del comentario es requerido.' });
        }

        const commentToDelete = await Comment.findById(_id);

        if (!commentToDelete) {
            return res.status(404).json({ message: 'No se ha encontrado el comentario para eliminar.' });
        }

        const commentDeleted = await Comment.deleteOne({ _id });

        return res.status(201).json({
            message: 'El comentario ha sido rliminado exitosamente.',
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor. Intenta nuevamente más tarde.' });
    }
}

export const updateComment = async (req, res) => {
    try {
        const { _id, content } = req.body;

        if (!_id) {
            return res.status(400).json({ message: 'El Id del comentario es requerido.' });
        }

        if (!content) {
            return res.status(400).json({ message: 'Se requiere un contenido para el comentario.' });
        }

        const commentToUpdate = await Comment.findById(_id);

        if (!commentToUpdate) {
            return res.status(404).json({ message: 'No se ha encontrado el comentario para actualizar.' });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            _id,
            {
                content
            },
            { new: true }
        );

        if (updatedComment) {
            return res.status(200).json({
                message: 'El comentario ha sido actualizado exitosamente',
                newContent : updatedComment.content,
            });
        }


    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor. Intenta nuevamente más tarde.' });
    }
}