const express = require('express')
const { commentsCreateCtrl, getCommentCtrl, deleteCommentCtrl, updateCommentCtrl } = require('../../controllers/comments/commentCtrl')
const commentRouter = express.Router();

commentRouter.post('/', commentsCreateCtrl)

//GET/api/v1/comments/:id
commentRouter.get('/:id', getCommentCtrl)


//DELETE/api/v1/comment/:id
commentRouter.delete('/:id', deleteCommentCtrl)

//PUT/api/v1/comment/:id
commentRouter.put('/:id', updateCommentCtrl)


module.exports = commentRouter;