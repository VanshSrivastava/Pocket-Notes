const mongoose = require ("mongoose");
const bcrypt = require("bcryptjs");
const { unique } = require("jquery");
const jwt = require("jsonwebtoken");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
         token:{
             type:String,
             required:true
         }
    }],
    notes:[{
        heading:{
            type:String,
            required:true,
            maxlength:10
           
            
        },
        content:{
            type:String,
            required:true
        }
    }]
})
//generating tokens
userSchema.methods.generateAuthToken=async function(){
    try{
        const token = jwt.sign({_id:this._id},process.env.SECRET_KEY );
        this.tokens= this.tokens.concat({token})
        await this.save();
        return token;
    }
 catch(err){
throw err;
}} 
//password to hash
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
        this.confirmpassword = await bcrypt.hash(this.password,10);
    } 
    next();
})
const Detail = new mongoose.model("note",userSchema);
module.exports=Detail;