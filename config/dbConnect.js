const mongoose = require('mongoose')

//DB connections
const dbConnect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('DB connected Successfully')

    } catch(error){
        console.log(error.message)
        process.exit(1)
    }
}

dbConnect();