import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userroute from "./routes/userroutes.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true}))
//Api endpoint
app.use('/api/auth',authRouter)
app.use('/api/user',userroute)
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})