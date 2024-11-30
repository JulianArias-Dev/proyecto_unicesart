import Post from '../models/post.models.js';
import Comment from '../models/comment.models.js'
import ReportedPost from '../models/reported_post.models.js'
import cloudinary from 'cloudinary';
import validator from 'validator';
import mongoose from 'mongoose';
import fs from 'fs';
import { formatFecha } from './shared_funtions.js';

export const createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'La imagen es requerida.' });
        }

        const { title, description, category, userId, username } = req.body;

        if (!title || title.length > 100) {
            return res.status(400).json({ message: 'El título es requerido y no puede exceder 100 caracteres.' });
        }
        if (!description || description.length > 500) {
            return res.status(400).json({ message: 'La descripción es requerida y no puede exceder 500 caracteres.' });
        }
        if (!category) {
            return res.status(400).json({ message: 'La categoría es requerida.' });
        }
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Se requiere una id de usuario valida' });
        }
        if (!username) {
            return res.status(400).json({ message: 'El nombre de usuario es requerido.' });
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: `post_${userId}_${Date.now()}`,
            overwrite: true,
        });

        const newPost = new Post({
            title,
            description,
            category,
            imageUrl: uploadResult.secure_url,
            user: {
                id: userId,
                username,
            },
        });

        const savedPost = await newPost.save();

        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error al eliminar el archivo local:', err);
        });

        return res.status(201).json({
            message: 'La publicación ha sido guardada exitosamente.',
            post: savedPost,
        });
    } catch (error) {
        console.error('Error al crear la publicación:', error);

        return res.status(500).json({
            message: 'Error al crear la publicación.',
            error: error.message,
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id, title, description, category, userid, username } = req.body;
        const postToUpdate = await Post.findById(id);

        if (!postToUpdate) {
            return res.status(404).json({ message: 'Publicación no encontrada.' });
        }

        let imageUrl = postToUpdate.imageUrl;

        if (req?.file) {
            try {
                const publicId = postToUpdate.imageUrl
                    ? postToUpdate.imageUrl.split('/').pop().split('.')[0]
                    : null;

                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    public_id: publicId || undefined,
                    overwrite: !!publicId,
                    upload_preset: 'unicesart_preset',
                });

                imageUrl = uploadResult.secure_url;

                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo local:', err);
                    }
                });
            } catch (uploadError) {
                console.error('Error uploading file to Cloudinary:', uploadError);
                return res.status(500).json({ message: 'Error al subir la imagen.', error: uploadError.message });
            }
        }

        // Update the post in the database
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                title,
                description,
                category,
                imageUrl, // Keep the current image URL or update it with the new one
                user: {
                    id: userid,
                    username,
                },
            },
            { new: true }
        );

        if (updatedPost) {
            return res.status(200).json({
                message: 'La publicación ha sido actualizada exitosamente',
                post: updatedPost,
            });
        }

        return res.status(404).json({ message: 'Publicación no encontrada.' });
    } catch (error) {
        console.error('Error al actualizar la publicación:', error);
        return res.status(500).json({ message: 'Error al actualizar la publicación.', error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: 'El ID del post es requerido.' });
        }

        const postToDelete = await Post.findById(id);

        if (!postToDelete) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        if (postToDelete.imageUrl) {
            const publicId = postToDelete.imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Comment.deleteMany({ "postId": postToDelete._id });
        await ReportedPost.deleteMany({ "publicacionReportada.id": postToDelete._id });
        await Post.findByIdAndDelete(postToDelete._id);

        return res.status(200).json({ message: 'La publicación ha sido eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar la publicación.', error: error.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const { id, username, category } = req.query;
        let publicaciones = [];

        if (id && username) {
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Se requiere una id de usuario valida' });
            }
            const sanitizedUser = validator.escape(username);
            const userid = validator.escape(id);
            publicaciones = await Post.find({
                'user.id': userid,
                'user.username': sanitizedUser,
                status: { $ne: "Suspendido" }
            }).lean();
        } else if (category) {
            const sanitizedCategory = validator.escape(category);
            publicaciones = await Post.find({
                category: sanitizedCategory,
                status: { $ne: "Suspendido" }
            }).lean();
        } else {
            publicaciones = await Post.find({
                status: { $ne: "Suspendido" }
            }).lean();
        }

        const publicacionesConLikes = publicaciones.map((publicacion) => ({
            ...publicacion,
            likesCount: publicacion.likes ? publicacion.likes.length : 0,
            date: formatFecha(publicacion.date),
        }));

        return res.status(200).json(publicacionesConLikes);
    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor. Intenta nuevamente más tarde.' });
    }
};


export const reactions = async (req, res) => {
    try {
        const { _id, user } = req.body;

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Se requiere una id de usuario valida' });
        }

        const id = validator.escape(_id);
        const post = await Post.findOne({ _id: id });

        if (!post) {
            return res.status(404).json({ message: 'No se encontró la publicación' });
        }

        const userIndex = post.likes.findIndex(
            like => like.user.id.toString() === user.id
        );

        if (userIndex > -1) {
            post.likes.splice(userIndex, 1);
            await post.save();
            return res.status(200).json({ message: 'Like eliminado' });
        } else {
            post.likes.push({ user });
            await post.save();
            return res.status(200).json({ message: 'Like agregado' });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
