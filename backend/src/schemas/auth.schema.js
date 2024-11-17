import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string({
        required_error: "Nombre completo es requerido",
    })
        .min(3, "El nombre completo debe tener al menos 3 caracteres")
        .max(50, "El nombre completo no debe exceder los 50 caracteres"),
    username: z.string({
        required_error: "Nombre de usuario es requerido",
    })
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .max(20, "El nombre de usuario no debe exceder los 20 caracteres"),

    gender: z.enum(["Masculino", "Femenino", "Otro"], {
        required_error: "Género es requerido",
    }),

    email: z.string({
        required_error: "Correo electrónico es requerido",
    })
        .email({
            message: "Correo electrónico no es válido",
        })
        .refine((value) => value.endsWith("@unicesar.edu.co"), {
            message: "El correo debe ser del dominio @unicesar.edu.co",
        }),

    password: z.string({
        required_error: "Contraseña es requerida",
    })
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
        .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
        .regex(/\d/, "La contraseña debe contener al menos un número")
        .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial"),
});

export const loginSchema = z.object({
    email: z.string({
        required_error: "Correo electrónico es requerido",
    })
        .email({
            message: "Correo electrónico no es válido",
        })
        .refine((value) => value.endsWith("@unicesar.edu.co"), {
            message: "El correo debe ser del dominio @unicesar.edu.co",
        }),

    password: z.string({
        required_error: "Contraseña es requerida",
    })
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
        .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
        .regex(/\d/, "La contraseña debe contener al menos un número")
        .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial"),
})

export const updateUserSchema = z.object({
    fullName: z.string(
        { required_error: "Nombre completo es requerido", }
    )
        .min(3, "El nombre completo debe tener al menos 3 caracteres")
        .max(50, "El nombre completo no debe exceder los 50 caracteres"),
    description: z.string()
        .max(500, "La descripción no debe exceder los 500 caracteres").optional(),
    skills: z.array(z.string()).optional(),
    profession: z.string()
        .max(50, "La profesión no debe exceder los 50 caracteres").optional(),
    birthDate: z.string().optional(), // Ajustar según el formato de fecha
    city: z.object({
        departamento: z.string().optional(),
        municipio: z.string().optional(),
    }).optional(),
    phone: z.string()
        .max(15, "El teléfono no debe exceder los 15 caracteres").optional(),
    gender: z.enum(["Masculino", "Femenino", "Otro"], {
        required_error: "Género es requerido",
    }),
    imageUrl: z.string().optional() // Campo de imagen opcional
});

export const profileSchema = z.object({
    id: z.string({
        required_error: "Se necesita una id de Usuario",
    })
});

export const updatePasswordSchema = z.object({
    userId: z.string().optional(),
    email: z.string().email("Correo electrónico no válido").optional(),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional,
    newPassword: z.string({
        required_error: "Contraseña es requerida",
    })
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
        .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
        .regex(/\d/, "La contraseña debe contener al menos un número")
        .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial"),
});

export const setCodeSchema = z.object({
    userId: z.string().optional(),
    password: z.string({
        required_error: "Contraseña es requerida",
    })
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
        .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
        .regex(/\d/, "La contraseña debe contener al menos un número")
        .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial"),
    email: z.string().email("Formato de email inválido").optional(),
}).refine(data => data.userId || data.email, {
    message: "Debes proporcionar userId o email.",
    path: ["userId", "email"],
});

export const dropAccountSchema = z.object({
    userId: z.string().min(24, "ID de usuario debe tener 24 caracteres").max(24, "ID de usuario debe tener 24 caracteres"),
})