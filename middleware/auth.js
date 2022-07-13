const jwt=require("jsonwebtoken");
const Detail=require("../models/details");
const auth = async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY);
        const user=await Detail.findOne({_id:verifyUser});
        if(!user){
            return res.render ("index")
        }
        req.token=token;
        req.user=user;
        next();
    }
catch(err){
    res.render("index");
}}
module.exports=auth;