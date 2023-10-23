const { appErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isLogin = (req, res, next) => {
    //get token from header
    const token = getTokenFromHeader(req);
    const decodedUser = verifyToken(token)
    //save the user into the request object
    req.userAuth = decodedUser.id
    if (!decodedUser) {
        return next(appErr('Invalid token, please login back', 500))
    }
    else {
        next();
    }
}

module.exports = isLogin