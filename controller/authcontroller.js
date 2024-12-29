import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import UserModel from "../models/usermodel.js";
import transporter from "../config/nodemailer.js";


export const register  = async (req,res)=>{
    const{name,email,password} = req.body;
    if(!name||!email||!password){
        return res.json({success:false,message:"Missing Details"})
    }
    
    try {
        const existinguser = await UserModel.findOne({email})
        if(existinguser){
            return res.json({success:false,message:"User already exists"})
        }
        
        const hashpassword = await bcrypt.hash(password,12);
        const user = new UserModel({name,email,password:hashpassword})
        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})

        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 1*24*60*60*1000
        })
        //Sending mail code
        const mailcontent = {
            from:process.env.SENDER_MAIL,
            to:email,
            subject: "Account Created Scuccessfully", 
            text: "Welcome to Hackmate. All your problem in one solution"
          }
        await transporter.sendMail(mailcontent)

        return res.json({success:true,message:"Account Created Successfully"})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

export const login = async (req ,res) => {

    const {email,password} = req.body;
    if(!email || !password){
        res.json({success:false,message:"Email and password are required"})
    }

    try {
        const user  =  await UserModel.findOne({email})
        if(!user){
            return res.json({success:false, message:"Invalid User"})
        }
        const passmatch = await bcrypt.compare(password,user.password)
        if(!passmatch){
            return res.json({success:false,message:"Incorrect Password"})
        }
        
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none': 'strict',
            maxAge: 1*24*60*60*1000
        })
        return res.json({success:true,message:"Logged Successfully"})

    } catch (error) {
        return res.json({succes:false,message:error.message})
    }
}  

export const logout = async (req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none': 'strict'
        })
        return res.json({success:true,message:"Logged Out"})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//sendotpaccount
export const sendotp = async (req,res)=>{
    try {
        const {userid} = req.body
        const user = await UserModel.findOne({_id:userid});
        if(user.isAccountVerified){
            return res.json({message:"Account is Verified"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyotp = otp
        user.verifyotpexpireat = Date.now() + 5*60*1000
        await user.save()
        const mailotpcontent = {
            from:process.env.SENDER_MAIL,
            to:user.email,
            subject: 'OTP to reset Password', 
            text: `OTP to reset your password ${otp}. The otp is valid upto 5 minutes.`
        }
        transporter.sendMail(mailotpcontent)
        return res.json({success:true,message:"Otp sended to your registerd mail Id"})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
//verifyotpaccount
export const verfiyotp = async (req,res)=>{
    try {
        const{userid, otp} = req.body
        
     if(!userid || !otp){
        return res.json({success:false,message:"Missing Details"})
     }
     const user = await UserModel.findOne({_id:userid})
     if(!user){
        return res.json({success:false,message:"User is not available"})
     }
     if(user.verifyotp === ''|| user.verifyotp !== otp){
        return res.json({success:false,message:"Invalid OTP"})
     }
     if(user.verifyotpexpireat < Date.now()){
        return res.json({success:false,message:"OTP Expired"})
     }
     user.isAccountVerified = true
     user.verfiyotp = ''
     user.verifyotpexpireat = 0
     await user.save()
     if(user.isAccountVerified == true){
        const mailsuccesscontent = {
            from:process.env.SENDER_MAIL,
            to:user.email,
            subject: "Account Verfied Scuccessfully", 
            text: `Welcome to Hackmate. Dear ${user.name} your account verfied successfully enjoy our services.`
          }
          await transporter.sendMail(mailsuccesscontent)
          return res.json({success:true, message:"Account verified Successfully"})
     }
        
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}