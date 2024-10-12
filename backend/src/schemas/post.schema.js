import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(1, "El título es requerido").max(100, "El título no puede exceder los 100 caracteres"),
    description: z.string().min(1, "La descripción es requerida").max(500, "La descripción no puede exceder los 500 caracteres"),
    category: z.string().min(1, "La categoría es requerida"),
    imageUrl: z.string().url("La URL de la imagen debe ser válida"),
    userId: z.string().min(24, "ID de usuario debe tener 24 caracteres").max(24, "ID de usuario debe tener 24 caracteres"),
    username: z.string().min(1, "El nombre de usuario es requerido"),
});

export const updatePostSchema = z.object({
    id: z.string().min(24, "ID de la publicación debe tener 24 caracteres").max(24, "ID de la publicación debe tener 24 caracteres"), // Validar el ID en params
    title: z.string().min(1, "El título es requerido").max(100, "El título no puede exceder los 100 caracteres").optional(), // Los campos son opcionales para actualización
    description: z.string().min(1, "La descripción es requerida").max(500, "La descripción no puede exceder los 500 caracteres").optional(),
    category: z.string().min(1, "La categoría es requerida").optional(),
    imageUrl: z.string().url("La URL de la imagen debe ser válida").optional(),
});

export const deletePostSchema = z.object({
    id: z.string().min(24, "ID de la publicación debe tener 24 caracteres").max(24, "ID de la publicación debe tener 24 caracteres"), // Validar el ID en params
});

export const getPostSchema = z.object({
    id: z.string().length(24, "ID de publicación debe tener 24 caracteres").optional(),
    username: z.string().optional(),
});

export const reactionsSchema = z.object({
    _id: z.string().length(24, "ID de publicación debe tener 24 caracteres"),
    user: z.object({
        id: z.string().length(24, "ID de usuario debe tener 24 caracteres"),
        username: z.string(),
    }),
});
