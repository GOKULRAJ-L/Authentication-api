import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    verifyotp:{type:String,default:''},
    verifyotpexpireat:{type:Number , default:0},
    resetotp:{type:String, default:''},
    resetotpexpireat:{type:Number, default:0},
    isAccountVerified:{type:Boolean, default:false}
})

const UserModel = mongoose.models.user || mongoose.model('user',UserSchema)

export default UserModel