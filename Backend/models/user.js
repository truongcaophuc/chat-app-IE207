const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
         required:[true,"First is required"]
  },
    lastName:{
        type:String,
        required:[true,"Last name is required"]
    },
    avatar:{
        type:String,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        validate:{
            validator:function(email){
                return String(email).toLowerCase().match(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/)
            }
        },
        message:(props)=>{
            return `Email ${props.value} is invalid!`
        }
    },
    password:{
        type:String,
    },
    passwordChangedAt:{
        type:Date,
    },
    passwordResetToken:{
        type:String,
    },
    passwordResetExpires:{
        type:Date,
    },
    createdAt:{
        type:Date,
    },
    updatedAt:{
        type:Date
    }
})
const User=new mongoose.model("User",userSchema)
module.exports=User