import Post from '../models/post.models.js';

export const createPost = async (req, res) => {
    try {
        
        const { title, description, category, imageUrl, userId, username } = req.body;

        const newPost = new Post(
            {
                title: title,
                description: description,
                category: category,
                imageUrl: imageUrl,
                user: {
                    id: userId,
                    username: username
                },
            }
        )

        const savedPost = await newPost.save();

        if (savedPost) {
            res.status(200).json({ message: 'La publicacion ha sido guardada Exitosamente' });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.body; 
        const { title, description, category, imageUrl} = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                title,
                description,
                category,
                imageUrl,                
            },
            { new: true } 
        );

        if (updatedPost) {
            return res.status(200).json({ message: 'La publicación ha sido actualizada exitosamente', updatedPost });
        }

        return res.status(404).json({ message: 'Publicación no encontrada' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.query; 

        const deletedPost = await Post.findByIdAndDelete(id);

        if (deletedPost) {
            return res.status(200).json({ message: 'La publicación ha sido eliminada exitosamente' });
        }

        return res.status(404).json({ message: 'Publicación no encontrada' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getPost = async (req, res) => {
    try {
        const { id, username } = req.query;

        let publicaciones = [];

        if (id && username) {
            publicaciones = await Post.find({
                'user.id': id,
                'user.username': username
            }).lean();
        } else {
            publicaciones = await Post.find().lean();
        }

        if (!publicaciones || publicaciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron publicaciones' });
        }

        const publicacionesConLikes = publicaciones.map((publicacion) => ({
            ...publicacion,
            likesCount: publicacion.likes ? publicacion.likes.length : 0,
        }));

        return res.status(200).json(publicacionesConLikes);
    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor. Intenta nuevamente más tarde.' });
    }
};


export const reactions = async (req, res) => {
    try {
        const { _id, user } = req.body;

        const post = await Post.findOne({ _id });

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
