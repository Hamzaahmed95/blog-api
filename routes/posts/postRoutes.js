const express = require('express')
const { postCreateCtrl, getPostCtrl, getAllPostsCtrl, deletePostCtrl, updatePostCtrl } = require('../../controllers/posts/postCtrl');
const isLogin = require('../../middlewares/isLogin');

const postRouter = express.Router();

//POST/api/v1/posts
postRouter.post('/',isLogin, postCreateCtrl)

//GET/api/v1/posts/:id
postRouter.get('/:id', getPostCtrl)

//GET/api/v1/posts
postRouter.get('/', getAllPostsCtrl)

//DELETE/api/v1/posts/:id
postRouter.delete('/:id', deletePostCtrl)

//PUT/api/v1/posts/:id
postRouter.put('/:id', updatePostCtrl)

module.exports = postRouter;