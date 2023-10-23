const bcrypt = require('bcryptjs')

const User = require("../../model/User/User")
const Post = require('../../model/Post/Post')
const Comment = require('../../model/Comment/Comment')
const Category = require('../../model/Category/Category')

const generateToken = require("../../utils/generateTokens")
const { appErr, AppErr } = require('../../utils/appErr')

//Register
const userRegisterCtrl = async (req, res, next) => {

    const { firstName, lastName, email, password } = req.body;
    try {
        //check if email exist
        const userFound = await User.findOne({ email })

        if (userFound) {
            return next(new AppErr("User already exist", 500))
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //create the user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        res.json({
            status: "success",
            data: user
        });
    } catch (error) {
        return next(appErr(error.message))
    }
}
//Login
const userLoginCtrl = async (req, res) => {
    const { email, password } = req.body
    try {
        //check if email exist
        const userFound = await User.findOne({ email })
        if (!userFound) {
            return res.json({
                msg: "Invalid login credentials"
            })
        }
        // verify password
        const isPasswordMatched = await bcrypt.compare(password, userFound.password)
        if (!isPasswordMatched) {
            return res.json({
                msg: "Invalid login credentials"
            })
        }
        res.json({
            status: "success",
            data: {
                firstName: userFound.firstName,
                lastName: userFound.lastName,
                email: userFound.email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id)
            }
        });
    } catch (error) {
        return next(appErr(error.message))
    }
}
//View Profile
const whoViewMyProfile = async (req, res, next) => {
    try {

        //1. Find the original user
        const user = await User.findById(req.params.id)

        //2. find the user who viewed the original user
        const userWhoViewed = await User.findById(req.userAuth)

        //3. Check if original user and who viewed are found
        if (user && userWhoViewed) {
            //4. Check if userWhoViewed is already in the users viewers array
            const isUserAlreadyViewed = user.viewers.find(viewer => viewer.toString() === userWhoViewed._id.toJSON())

            if (isUserAlreadyViewed) {
                return next(appErr("You already viewed this profile"))
            }
            else {
                //5. Push the userWhoViewed to the user's viewers array
                user.viewers.push(userWhoViewed._id)

                //6. Save the user
                await user.save()
                res.json({
                    status: "success",
                    data: "you have successfuly viewed this profile"
                });
            }
        }
    } catch (error) {
        return next(appErr(error.message))
    }
}
//User Following
const followingCtrl = async (req, res, next) => {
    try {
        //1. Find the user to follow
        const userToFollow = await User.findById(req.params.id)

        //2. Find the user who is following
        const userWhoFollow = await User.findById(req.userAuth)

        //3. Check if user and userwhoFollow are found
        if (userToFollow && userWhoFollow) {
            //4. check if user who followed is already in the user followers array
            const isUserAlreadyFollowed = userToFollow.following.find(follower => {
                return follower.toString() === userWhoFollow._id.toString()
            })
            if (isUserAlreadyFollowed) {
                return next(appErr('You already followed this user'))
            } else {
                //5. push userWhoFollowed to the user's followers array
                userToFollow.followers.push(userWhoFollow._id);

                //6. push userToFollow to the user's following array
                userWhoFollow.following.push(userToFollow._id)

                //save users
                await userWhoFollow.save()
                await userToFollow.save()
                res.json({
                    status: "success",
                    data: "You have successfully followed this user"
                });
            }
        }
    } catch (error) {
        return next(appErr(error.message))
    }
}
//User Unfollowing
const unfollowingCtrl = async (req, res, next) => {
    try {
        //1. Find the user to unfollow
        const userToUnfollow = await User.findById(req.params.id)

        //2. Find the user who is unfollowing
        const userWhoUnfollowed = await User.findById(req.userAuth)

        //3. Check if userToUnfollow and userWhoUnfollowed are found

        if (userToUnfollow && userWhoUnfollowed) {
            //4. check if user who followed is already in the user followers array
            const isUserAlreadyFollowed = userToUnfollow.followers.find(follower => {
                return follower.toString() === userWhoUnfollowed._id.toString()
            })

            if (!isUserAlreadyFollowed) {
                return next(appErr('You have not followed this user'))
            } else {
                //5. remove userWhoFollowed from the user's followers array
                userToUnfollow.followers = userToUnfollow.followers.filter(follower => {
                    return follower.toString() !== userWhoUnfollowed._id.toString()
                })

                //save users
                await userToUnfollow.save()

                userWhoUnfollowed.following = userWhoUnfollowed.following.filter(following => {
                    return following.toString() !== userToUnfollow._id.toString()
                })

                await userWhoUnfollowed.save()
                res.json({
                    status: "success",
                    data: "You have successfully unfollowed this user"
                });
            }
        }
    } catch (error) {
        return next(appErr(error.message))
    }
}
//Show User Profile
const userProfileCtrl = async (req, res) => {
    try {
        const user = await User.findById(req.userAuth)
        res.json({
            status: "success",
            data: user
        });
    } catch (error) {
        return next(appErr(error.message))
    }
}
//User Block other User
const blockUserCtrl = async (req, res, next) => {
    try {
        //1. Find user to be blocked
        const userToBeBlocked = await User.findById(req.params.id)

        //2. Find the user who is blocking
        const userWhoBlocked = await User.findById(req.userAuth)

        //3. Check if userToBeBlocked and userWhoBlocked are found
        if (userWhoBlocked && userToBeBlocked) {
            //4. If user has already blocked particular blocked
            const isUserAlreadyBlocked = userWhoBlocked.blocked.find(blocked => {
                return blocked.toString() === userToBeBlocked._id.toString()
            })
            if (isUserAlreadyBlocked) {
                return next(appErr('You have already blocked this user'))
            }

            //Push userTobeBlocked to the userWhoBlocked's blocked array
            userWhoBlocked.blocked.push(userToBeBlocked._id)
            await userWhoBlocked.save()

            res.json({
                status: "success",
                data: "You have successfully blocked this user"
            })
        }

    }
    catch (error) {
        return next(appErr(error.message))
    }
}
//User Unblock other User
const unblockUserCtrl = async (req, res, next) => {
    try {
        //1. Find user to be unblocked
        const userToBeUnblocked = await User.findById(req.params.id)

        //2. Find the user who is unblocking
        const userWhoUnblock = await User.findById(req.userAuth)

        //3. Check if userToBeUnblocked and userWhoUnblock are found
        if (userWhoUnblock && userToBeUnblocked) {
            //4. Check if userToBeUnblocked is already in userWhoUnblock's blocked list
            const isUserAlreadyBlocked = userWhoUnblock.blocked.find(blocked => {
                return blocked.toString() === userToBeUnblocked._id.toString()
            })
            if (!isUserAlreadyBlocked) {
                return next(appErr('You have not blocked this user'))
            }

            //Push userToBeUnblocked to the userWhoUnblock's blocked array
            userWhoUnblock.blocked = userWhoUnblock.blocked.filter(blocked => blocked.toString() !== userToBeUnblocked._id.toString())
            await userWhoUnblock.save()

            res.json({
                status: "success",
                data: "You have successfully unblocked this user"
            })
        }

    }
    catch (error) {
        return next(appErr(error.message))
    }
}
//Admin Block any user
const adminBlockUserCtrl = async (req, res, next) => {
    try {
        //1. Find the user to be blocked
        const userToBeBlocked = await User.findById(req.params.id)

        //2. Check if userToBeBlocked found
        if (!userToBeBlocked) {
            return next(appErr('User not found'))
        }

        //3. Change the isBlocked to true
        userToBeBlocked.isBlocked = true;

        //4. save
        await userToBeBlocked.save()

        res.json({
            status: "success",
            data: "Admin blocked User"
        })
    }
    catch (error) {
        return next(appErr(error.message))
    }
}
//Admin Unblock any user
const adminUnblockUserCtrl = async (req, res, next) => {
    try {
        //1. Find the user to be unblocked
        const userToBeUnblocked = await User.findById(req.params.id)

        //2. Check if userToBeBlocked found
        if (!userToBeUnblocked) {
            return next(appErr('User not found'))
        }

        //3. Change the isBlocked to true
        userToBeUnblocked.isBlocked = false;

        //4. save
        await userToBeUnblocked.save()

        res.json({
            status: "success",
            data: "Admin successfully unblocked User"
        })
    }
    catch (error) {
        return next(appErr(error.message))
    }
}
//Get All users
const getAllUsersCtrl = async (req, res) => {

    const users = await User.find()
    try {
        res.json({
            status: "success",
            data: users
        });
    } catch (error) {
        return next(appErr(error.message))
    }
}
//Update user profile
const userUpdateCtrl = async (req, res, next) => {
    try {
        const { firstName, lastName, email } = req.body
        //check if email is not taken

        if (email) {
            const emailTaken = await User.findOne({ email })
            if (emailTaken) {
                next(appErr("Email is taken", 400))
            }
        }

        //update user
        const user = await User.findByIdAndUpdate(req.userAuth, {
            firstName,
            lastName,
            email
        }, {
            new: true,
            runValidators: true
        })

        res.json({
            status: "success",
            data: user
        });
    } catch (error) {
        return next(appErr(error.message))
    }
}
//Update Password
const passwordUpdateCtrl = async (req, res, next) => {
    const { password } = req.body
    try {
        //Check if user is updating password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)

            //update user
            const user = await User.findByIdAndUpdate(req.userAuth, { password: hashedPassword }, { new: true, runValidators: true })
            res.json({
                status: "success",
                data: "password has been changed successfully"
            });
        } else {
            return next(appErr("Please provide password field"))
        }

    } catch (error) {
        return next(appErr(error.message))
    }
}
//Delete User profile
const deleteAccountCtrl = async (req, res, next) => {

    try {
        //1. Find the user to be deleted
        const userToBeDeleted = await User.findById(req.userAuth);

        //2. Find all posts to be deleted
        await Post.deleteMany({ user: req.userAuth })

        //3. Delete all comments from user
        await Comment.deleteMany({ user: req.userAuth })

        await Category.deleteMany({ user: req.userAuth })

        await userToBeDeleted.deleteOne()
        res.json({
            status: "success",
            data: "Your account has been deleted"
        });
    } catch (error) {
        return next(appErr(error.message))
    }
}
//User upload photo
const profilePhotoUploadCtrl = async (req, res, next) => {

    try {
        //1. find the user to be updated 
        const userToUpdate = await User.findById(req.userAuth)

        //2. if user is found
        if (!userToUpdate) {
            return next(appErr('User not found', 403))
        }
        //3. if user is being blocked
        if (userToUpdate.isBlocked) {
            return next(appErr('Action not allowed, your account is blocked', 403))
        }
        //4. if user is updating their photo
        if (req.file) {
            await User.findByIdAndUpdate(
                req.userAuth,
                {
                    $set: {
                        profilePhoto: req.file.path,
                    },
                },
                {
                    new: true,
                }
            )
        }
        //5. update profile photo
        res.json({
            status: "success",
            data: "You have successfully updated your profile photo "
        });
    } catch (error) {
        next(appErr(error.message, 500))
    }
}

module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    userProfileCtrl,
    getAllUsersCtrl,
    userUpdateCtrl,
    profilePhotoUploadCtrl,
    whoViewMyProfile,
    followingCtrl,
    unfollowingCtrl,
    blockUserCtrl,
    unblockUserCtrl,
    adminBlockUserCtrl,
    adminUnblockUserCtrl,
    passwordUpdateCtrl,
    deleteAccountCtrl
}