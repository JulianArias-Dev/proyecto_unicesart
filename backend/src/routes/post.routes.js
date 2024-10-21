import { Router } from "express";
import { createPost, deletePost, getPost, reactions, updatePost } from "../controllers/post.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createPostSchema, getPostSchema, reactionsSchema} from "../schemas/post.schema.js";
import multer from 'multer';

const routerPost = Router()
const upload = multer({ dest: 'uploads/' });

routerPost.post('/createPost', upload.single('image'), authRequired,  validateSchema(createPostSchema),createPost);
routerPost.put('/update-post', upload.single('file'), authRequired, updatePost);
routerPost.delete('/remove-post', authRequired, deletePost);
routerPost.get('/getPost', validateSchema(getPostSchema), getPost);
routerPost.put('/reaction', authRequired,validateSchema(reactionsSchema), reactions);

export default routerPost;