import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            message: "Usted debe Iniciar Sesión para realizar esta acción"
        });
    }

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({
            message : "Invalid Token"
        });

        req.user = user;

        next();
    })
}