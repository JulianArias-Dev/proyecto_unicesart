import { Router } from "express";
import { login, register, logout, profile, updateUser, updatePassword, setCode, dropAccount, suspendUser } from "../controllers/auth.controller.js";
import { getCategorias, getUbicaciones } from "../controllers/recursos.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema, updateUserSchema, profileSchema, updatePasswordSchema, setCodeSchema, dropAccountSchema } from "../schemas/auth.schema.js";


const router = Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.post('/logout', authRequired, logout);
router.post('/updateuser', authRequired, validateSchema(updateUserSchema), updateUser)
router.put('/updatepassword', authRequired, updatePassword)
router.put('/recover-password', validateSchema(updatePasswordSchema), updatePassword)
router.put('/set-recover-code', validateSchema(setCodeSchema), setCode);
router.get('/profile', validateSchema(profileSchema), profile);

/** */
router.delete('/removeAccount', authRequired, validateSchema(dropAccountSchema), dropAccount);
router.put('/suspend-user', authRequired, suspendUser);

router.get('/ubicaciones', getUbicaciones);
router.get('/categorias', getCategorias);

export default router;