const Category = require("../../model/Category/Category");
const { appErr } = require("../../utils/appErr");

//create category
const categoryCreateCtrl = async (req, res, next) => {
    const { title } = req.body
    try {
        const category = await Category.create({ title, user: req.userAuth })
        res.json({
            status: "success",
            data: category
        });
    } catch (error) {

        return next(appErr(error.message))
    }
}
//fetch all categories
const fetchCategoriesCtrl = async (req, res, next) => {
    try {
        const categories = await Category.find()
        res.json({
            status: "success",
            data: categories
        });
    } catch (error) {
        return next(appErr(error.message))
    }
}
//fetch single category
const getCategoryCtrl = async (req, res) => {
    try {
        const singleCategory = await Category.findById(req.params.id)
        res.json({
            status: "success",
            data: singleCategory
        });
    } catch (error) {
        res.json(error.message)
    }
}
//delete single category
const deleteCategoryCtrl = async (req, res) => {
    try {
        const deleteCategory = await Category.findByIdAndDelete(req.params.id)
        res.json({
            status: "success",
            data: "category has been deleted successfully"
        });
    } catch (error) {
        res.json(error.message)
    }
}
//update single category
const updateCategoryCtrl = async (req, res) => {
    const { title } = req.body
    try {
        const updateCategory = await Category.findByIdAndUpdate(req.params.id, { title }, { new: true, runValidators: true })
        res.json({
            status: "success",
            data: updateCategory
        });
    } catch (error) {
        res.json(error.message)
    }
}

module.exports = {
    fetchCategoriesCtrl, categoryCreateCtrl, getCategoryCtrl, deleteCategoryCtrl, updateCategoryCtrl
}