import Listing from "../models/listing.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import mongoose from "mongoose"
export const test=(req,res)=>{
    res.send("Hello Api")
}


export const updateUser=async (req,res,next)=>{
    if (req.user.id!==req.params.id){
        return  next(errorHandler(401,"Unauthorized"))
    }
    try{
        if (req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10)
        }
        const updateUser=await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar,
            }
        },{new:true})

        res.status(200)
        res.json(updateUser)
    }
    catch (error){

    }

}

export const deleteUser=async(req,res,next)=>{

    try{
        if (req.user.id!==req.params.id){
            return  next(errorHandler(401,"Unauthorized"))
        }
        await User.findByIdAndDelete(req.params.id)
        res.status(200)
        res.json("User deleted successfully")
    }
    catch(error){
        next(error)
    }
}


export const getUserListings=async (req,res,next)=>{

    if (req.user.id!==req.params.id){
        return next(errorHandler(401,'unauthorized'))
    }
    else{
        try{
            const listing=await Listing.find({userRef:req.params.id})
            res.status(200)
            res.json(listing)
        }
        catch(error){
            next(error)
        }
    }
}
   