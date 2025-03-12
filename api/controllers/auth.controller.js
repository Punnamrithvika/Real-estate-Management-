import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'
export const SignUp=async (req,res,next)=>{
    const {username,email,password}=req.body;
    const hashedPassword=bcryptjs.hashSync(password,10)
    const newUser=new User({username,email,password:hashedPassword})
    try{
        await newUser.save();
        res.status(201).json("user added successfully")
    }
    catch(error){ 
       next(error)
    }
}

export const SignIn=async(req,res,next)=>{
    const {email,password}=req.body 
    try{
        const validUser=await User.findOne({email})
        if (!validUser){
            return next(errorHandler(404,"user not found"))
        }
        const validPassword=await bcryptjs.compareSync(password,validUser.password)
        if (!validPassword){
            return next(errorHandler(401,"Wrong Credentials"))
        }
        const token=jwt.sign({id:validUser._id},process.env.JWT_TOKEN)
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(validUser)
    }
    catch(error){
        next(error)
    }
}

export const Google=async (req,res,next)=>{
    try{
        const {name,email,photo}=req.body 
        const validUser=await User.findOne({email})
        if (validUser){
            const token=jwt.sign({id:validUser._id},process.env.JWT_TOKEN)
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(validUser)
        }
        else{
            const generatedPassword=Math.random().toString(36).slice(-8)
            const hashedPassword=await bcryptjs.hashSync(generatedPassword,10);
            const newUser=new User({username:name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-8),email,password:hashedPassword,avatar:photo})
            await newUser.save()
            const token=jwt.sign({id:validUser._id},process.env.JWT_TOKEN)
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(validUser)

        }

    }
    catch(error){
        next(error)
    }
}


export const Signout = async (req, res, next) => {
    try {
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
    }
  };