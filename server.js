const express = require('express');

const userRouter = require('./routes/users/userRoutes')
const postRouter = require('./routes/posts/postRoutes')
const commentRouter = require('./routes/comments/commentRoutes')
const categoryRouter = require('./routes/categories/categoryRoutes');

const globalErrHandler = require('./middlewares/globalErrHandler');

require('dotenv').config()
require("./config/dbConnect")

const app = express()

//-----
//middlewares
//-----

app.use(express.json()) //pass incoming payload

const userAuth = {
    isLogin: true,
    isAdmin: false
};

app.use((req, res, next) => {
    if (userAuth.isLogin) {
        next()
    }
    else {
        return res.json({
            msg: "Invalid login credentials"
        })
    }
})


//-----
//routes
//-----

//users route
app.use('/api/v1/users/', userRouter)

//posts route
app.use('/api/v1/posts/', postRouter)

//comments route
app.use('/api/v1/comments', commentRouter)

//categories route
app.use('/api/v1/categories', categoryRouter)

//-----
//Error handlers
//-----

//global error handlers
app.use(globalErrHandler)

//404 error
app.use('*',(req,res)=>{
    res.status(404).json({
        message:`${req.originalUrl } - Route Not Found` 
    })
})

//listen to servers
const PORT = process.env.PORT || 9000

app.listen(PORT, console.log(`Server is up and running on ${PORT}`))
