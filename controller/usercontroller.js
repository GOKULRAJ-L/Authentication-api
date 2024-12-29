import UserModel from "../models/usermodel.js";

const getdata = async (req,res)=>{
    try {
        const {userid} = req.body
        const user = await UserModel.findOne({_id:userid})
        if(!user){
            return res.json({success:false,message:"User is not available"})
        }
        return res.json({success:true,
            userdata:{
                name:user.name,
                accountverified:user.isAccountVerified
            }
        })
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
export default getdata