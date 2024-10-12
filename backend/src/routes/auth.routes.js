import { Router } from "express";
import { login, register, logout, profile, updateUser, updatePassword, setCode, dropAccount } from "../controllers/auth.controller.js";
import { getCategorias, getUbicaciones } from "../controllers/recursos.controller.js";
import { createPost, deletePost, getPost, reactions, updatePost } from "../controllers/post.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema, updateUserSchema, profileSchema, updatePasswordSchema, setCodeSchema, dropAccountSchema } from "../schemas/auth.schema.js";
import { createPostSchema, deletePostSchema, getPostSchema, reactionsSchema, updatePostSchema } from "../schemas/post.schema.js";

const router = Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.post('/logout', authRequired, logout);
router.post('/updateuser', authRequired, validateSchema(updateUserSchema), updateUser)
router.put('/updatepassword', authRequired, validateSchema(updatePasswordSchema), updatePassword)
router.put('/recover-password', validateSchema(updatePasswordSchema), updatePassword)
router.put('/set-recover-code', validateSchema(setCodeSchema),setCode);
router.get('/profile', validateSchema(profileSchema), profile);

/** */
router.delete('/removeAccount', authRequired, validateSchema(dropAccountSchema), dropAccount);

router.post('/createPost', authRequired, validateSchema(createPostSchema), createPost);
router.put('/update-post', authRequired, validateSchema(updatePostSchema), updatePost);
router.delete('/remove-post', authRequired, validateSchema(deletePostSchema), deletePost);
router.get('/getPost', validateSchema(getPostSchema),getPost);
router.put('/reaction', authRequired,validateSchema(reactionsSchema), reactions);

router.get('/ubicaciones', getUbicaciones);
router.get('/categorias', getCategorias);

export default router;