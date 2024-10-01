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
        .regex(/[0-9]/, "La contraseña debe contener al menos un número")
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
        .regex(/[0-9]/, "La contraseña debe contener al menos un número")
        .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial"),
})
