const User = require("../model/User/User");
const { appErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isAdmin = async (req, res, next) => {
    //get token from header
    const token = getTokenFromHeader(req);
    const decodedUser = verifyToken(token)

    //save the user into the request object
    req.userAuth = decodedUser.id
    
    const user = await User.findById(decodedUser.id)
    if (!user.isAdmin) {
        return next(appErr('Access Denied, Admin Only', 403))
    }
    else {
        next();
    }


}

module.exports = isAdmin