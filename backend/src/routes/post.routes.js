import { Router } from "express";
import multer from 'multer';
import { authRequired } from "../middlewares/validateToken.js";
import { createPost, deletePost, getPost, reactions, updatePost } from "../controllers/post.controller.js";
import { deleteComment, getComments, saveComment, updateComment } from "../controllers/comment.controller.js";
import { deleteAdd, getAdds, saveNew, updateNew, } from '../controllers/news.controller.js'

const routerPost = Router()
const upload = multer({ dest: 'uploads/' });

routerPost.post('/createPost', upload.single('image'), authRequired,  createPost);
routerPost.put('/update-post', upload.single('image'), authRequired, updatePost);
routerPost.delete('/remove-post', authRequired, deletePost);
routerPost.get('/getPost',  getPost);
routerPost.put('/reaction', authRequired,  reactions);

routerPost.get('/getComments', getComments);
routerPost.post('/save-comment', authRequired, saveComment);
routerPost.delete('/delete-comment', authRequired, deleteComment);
routerPost.put('/update-comment', authRequired, updateComment);

routerPost.post('/save-new', upload.single('image'), authRequired, saveNew);
routerPost.put('/update-new', upload.single('image'), authRequired, updateNew);
routerPost.get('/getAdds', getAdds);
routerPost.delete('/delete-add', authRequired, deleteAdd);

export default routerPost;