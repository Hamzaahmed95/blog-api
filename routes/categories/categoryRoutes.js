const express = require('express')
const { fetchCategoriesCtrl, categoryCreateCtrl, getCategoryCtrl, deleteCategoryCtrl, updateCategoryCtrl } = require('../../controllers/categories/categoryCtrl');
const isLogin = require('../../middlewares/isLogin');

const categoryRouter = express.Router();

//POST/api/v1/categories'
categoryRouter.post('/', isLogin, categoryCreateCtrl)

categoryRouter.get('/', fetchCategoriesCtrl)

//GET/api/v1/categories/:id
categoryRouter.get('/:id', getCategoryCtrl)

//DELETE/api/v1/categories/:id
categoryRouter.delete('/:id', isLogin, deleteCategoryCtrl)

//PUT/api/v1/categories/:id
categoryRouter.put('/:id', updateCategoryCtrl)

module.exports = categoryRouter;