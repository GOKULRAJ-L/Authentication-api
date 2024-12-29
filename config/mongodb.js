import mongoose from 'mongoose'

const connectDB = async ()=>{
    mongoose.connection.on('connected',()=>console.log("Connected to the Database"))
    await mongoose.connect(process.env.MONGODB_URL)
    .catch((err)=>console.error("Error Connecting to Database:",err))
}

export default connectDB;