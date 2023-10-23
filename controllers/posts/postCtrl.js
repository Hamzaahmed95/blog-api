const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const appErr = require("../../utils/appErr")

const postCreateCtrl = async (req, res, next) => {

    const { title, description, category } = req.body;

    try {
        //1. Find the user 
        const author = await User.findById(req.userAuth)
        //2. Create the post
        if (author.isBlocked) {
            return next(appErr("Access denied, account blocked, 402"))
        }
        const postCreated = await Post.create({
            title,
            description,
            user: author._id,
            category
        })
        //3. Associate user to post
        author.posts.push(postCreated);
        await author.save()

        res.json({
            status: "success",
            data: "postCreated"
        });
    } catch (error) {
        res.json(error.message)
    }
}
const getPostCtrl = async (req, res) => {
    try {
        res.json({
            status: "success",
            data: "post route"
        });
    } catch (error) {
        res.json(error.message)
    }
}

const getAllPostsCtrl = async (req, res) => {
    try {
        res.json({
            status: "success",
            data: "posts route"
        });
    } catch (error) {
        res.json(error.message)
    }
}

const deletePostCtrl = async (req, res) => {
    try {
        res.json({
            status: "success",
            data: "delete posts route"
        });
    } catch (error) {
        res.json(error.message)
    }
}

const updatePostCtrl = async (req, res) => {
    try {
        res.json({
            status: "success",
            data: "update posts route"
        });
    } catch (error) {
        res.json(error.message)
    }
}

module.exports = {
    postCreateCtrl, getPostCtrl, getAllPostsCtrl, deletePostCtrl, updatePostCtrl
}