import { Router } from "express";
import { login, register, logout, profile, updateUser, updatePassword, setCode, dropAccount } from "../controllers/auth.controller.js";
import { getCategorias, getUbicaciones } from "../controllers/recursos.controller.js";
import { createPost, getPost, reactions } from "../controllers/post.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.post('/logout', authRequired, logout);
router.post('/updateuser', authRequired, updateUser)
router.put('/updatepassword', authRequired, updatePassword)
router.put('/recover-password', updatePassword)
router.put('/set-recover-code', setCode);
router.get('/profile', profile);

/** */
router.delete('/removeAccount', authRequired,dropAccount);

router.post('/createPost', authRequired, createPost);
router.get('/getPost', getPost);
router.put('/reaction', authRequired, reactions);

router.get('/ubicaciones', getUbicaciones);
router.get('/categorias', getCategorias);

export default router;