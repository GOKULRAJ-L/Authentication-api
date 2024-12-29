import express from "express"
import userAuth from "../middleware/middleware.js"
import getdata from "../controller/usercontroller.js"

const userroute = express.Router()

userroute.get('/data',userAuth,getdata)

export default userroute