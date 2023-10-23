const mongoose = require('mongoose');
const Post = require('../Post/Post');

//create Schema

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required']
    },
    profilePhoto: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },

    isBlocked: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Editor'],
    },
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }
    ],
    blocked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    // plan: {
    //     type: String,
    //     enum: ['Free', 'Premium', 'Pro'],
    //     default: 'Free',
    // },
    userAward: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold'],
        default: 'Bronze'
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }
)

//Hooks
//pre-before record is saved
userSchema.pre('findOne', async function (next) {

    //populate the post
    this.populate({
        path: "posts"
    })
    //get the user id
    const userId = this._conditions._id
    //find the post created by user
    const posts = await Post.find({ user: userId })
    //get the last post created by user
    const lastPost = posts[[posts.length - 1]]

    //get the last post date
    const lastPostDate = new Date(lastPost?.createdAt);

    //get the last post date in string format
    const lastPostDateStr = lastPostDate.toDateString();

    //add virtual property to user
    userSchema.virtual('lastPostDate').get(function () {
        return lastPostDateStr
    })

    //check if user is inactive for 30 days

    //get current date 
    const currentDate = new Date();

    const diff = currentDate - lastPostDate;

    //get the difference in days
    const diffInDays = diff / (1000 * 3600 * 24);
    if (diffInDays > 30) {
        //Add virtual property inActive to user Model
        userSchema.virtual("isInactive").get(function () {
            return true;
        })

        //find the user by ID and update 
        await User.findByIdAndUpdate(
            userId,
            {
                isBlocked: true
            },
            {
                new: true
            }
        )
    }
    else {
        userSchema.virtual("isInactive").get(function () {
            return false;
        })
        //find the user by ID and update 
        await User.findByIdAndUpdate(
            userId,
            {
                isBlocked: false
            },
            {
                new: true
            }
        )
    }

    //Last active dates

    const daysAgo = Math.floor(diffInDays)
    userSchema.virtual('lastActive').get(function () {
        if (daysAgo <= 0) {
            return "Today"
        }
        if (daysAgo === 1) {
            return "Yesterday"
        }
        if (daysAgo > 1) {
            return `${daysAgo} days ago`
        }
    })

    //update use award based on number of posts

    const numOfPosts = posts.length;
    if (numOfPosts < 10) {
        await User.findByIdAndUpdate(userId, {
            userAward: "Bronze"
        }, {
            new: true
        })
    }
    if (numOfPosts > 10) {
        await User.findByIdAndUpdate(userId, {
            userAward: "Silver"
        }, {
            new: true
        })
    }
    if (numOfPosts > 20) {
        await User.findByIdAndUpdate(userId, {
            userAward: "Gold"
        }, {
            new: true
        })
    }

    next()
})
//post -after saving 
userSchema.post('save', function (next) {
    console.log('post hook')
})

//Get fullname
userSchema.virtual('fullname').get(function () {
    return `${this.firstName} ${this.lastName}`
})

//Get initials
userSchema.virtual('initials').get(function () {
    return `${this.firstName[0]}${this.lastName[0]}`
})


//get posts count
userSchema.virtual('postCounts').get(function () {
    return this.posts.length
})

//get followers count
userSchema.virtual('followingCounts').get(function () {
    return this.following.length
})

//get viewers count
userSchema.virtual('viewersCounts').get(function () {
    return this.viewers.length
})

//get blocked count
userSchema.virtual('blockedCounts').get(function () {
    return this.blocked.length
})

const User = mongoose.model('User', userSchema)

module.exports = User;

