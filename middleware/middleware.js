import jwt from "jsonwebtoken"

const userAuth = async (req,res,next)=>{
   const {token} = req.cookies
   if(!token){
    return res.json({success:false,message:"Unauthorized Login again"})
   }
   try {
       const jwttoken = jwt.verify(token,process.env.JWT_SECRET)
       if(jwttoken){
        req.body.userid = jwttoken.id
       }
       else{
        return res.json({success:false,message:"Unauthorized Login again"})
       }
       next()
   } catch (error) {
    return res.josn({success:false,message:error.message})
   }
}

export default userAuth