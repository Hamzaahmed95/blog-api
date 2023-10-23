const commentsCreateCtrl = async (req, res) => {
    try {
        res.json({
            status: "success",
            data: "comments created"
        });
    } catch (error) {
        res.json(error.message)
    }
}

const getCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: "success",
            data: "comment route"
        });
    } catch (error) {
        res.json(error.message)
    }
}

const deleteCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: "success",
            data: "delete comment route"
        });
    } catch (error) {
        res.json(error.message)
    }
}
const updateCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: "success",
            data: "update comment route"
        });
    } catch (error) {
        res.json(error.message)
    }
}


module.exports = {
    commentsCreateCtrl, getCommentCtrl, deleteCommentCtrl, updateCommentCtrl
}