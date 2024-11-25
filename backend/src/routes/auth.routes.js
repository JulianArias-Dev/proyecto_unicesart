import { Router } from "express";
import { login, register, logout, profile, updateUser, updatePassword, setCode, dropAccount, suspendUser, searchUsers } from "../controllers/auth.controller.js";
import { getCategorias, getUbicaciones } from "../controllers/recursos.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authRequired, logout);
router.post('/updateuser', authRequired, updateUser)
router.put('/updatepassword', authRequired, updatePassword)
router.put('/recover-password', updatePassword)
router.put('/set-recover-code', setCode);
router.get('/profile', profile);
router.get('/users', searchUsers);

/** */
router.delete('/removeAccount', authRequired, dropAccount);
router.put('/suspend-user', authRequired, suspendUser);

router.get('/ubicaciones', getUbicaciones);
router.get('/categorias', getCategorias);

export default router;