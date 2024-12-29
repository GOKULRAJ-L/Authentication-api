import express from "express"
import { login,register,logout, sendotp, verfiyotp} from "../controller/authcontroller.js";
import userAuth from "../middleware/middleware.js";
const authRouter = express.Router();

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/sendOtp',userAuth,sendotp)
authRouter.post('/verifyOtp',userAuth,verfiyotp)

export default authRouter