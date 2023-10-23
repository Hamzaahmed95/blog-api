const express = require('express')

const userRouter = express.Router();
const { userRegisterCtrl, adminUnblockUserCtrl, adminBlockUserCtrl, unblockUserCtrl, followingCtrl, blockUserCtrl, whoViewMyProfile, userLoginCtrl, userProfileCtrl, getAllUsersCtrl, userUpdateCtrl, profilePhotoUploadCtrl, unfollowingCtrl, passwordUpdateCtrl, deleteAccountCtrl } = require('../../controllers/users/userCtrl');
const isLogin = require('../../middlewares/isLogin');
const storage = require('../../config/cloudinary');
const multer = require('multer');
const isAdmin = require('../../middlewares/isAdmin');


//instance of multer
const upload = multer({ storage })

userRouter.post("/register", userRegisterCtrl);

userRouter.post('/login', userLoginCtrl)

userRouter.get('/profile', isLogin, userProfileCtrl)

userRouter.put('/update-password', isLogin, passwordUpdateCtrl)

userRouter.get('/', getAllUsersCtrl)

userRouter.put('/', isLogin, userUpdateCtrl)

userRouter.get('/profile-viewers/:id', isLogin, whoViewMyProfile)

userRouter.get('/following/:id', isLogin, followingCtrl)

userRouter.get('/unfollowing/:id', isLogin, unfollowingCtrl)

userRouter.get('/block/:id', isLogin, blockUserCtrl)

userRouter.put('/admin-block/:id', isLogin, isAdmin, adminBlockUserCtrl)

userRouter.put('/admin-unblock/:id', isLogin, isAdmin, adminUnblockUserCtrl)

userRouter.get('/unblock/:id', isLogin, unblockUserCtrl)

userRouter.delete('/delete-account', isLogin, deleteAccountCtrl)

userRouter.post('/profile-photo-upload', isLogin, upload.single('profile'), profilePhotoUploadCtrl)

module.exports = userRouter;
