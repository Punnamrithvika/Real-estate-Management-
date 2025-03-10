import React, { use } from "react";
import {Link} from 'react-router-dom'
import {useState} from 'react'
import { set } from "mongoose";
import { useNavigate } from "react-router-dom";
import {useDispatch,useSelector} from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice.js";

import Oauth from "../components/Oauth.jsx";
export default function SignIn(){
    const [formData,setFormData]=useState({
        username: "",
        email: "",
        password: ""
    })
   const {loading,error}=useSelector((state)=>state.user)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.id]:e.target.value
        })
    }

    const handleSubmit=async (e)=>{
        e.preventDefault()
         dispatch(signInStart());
        try{
            const apiUrl="/api/auth/signin"
            const options={
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(formData)
            }
            const res=await fetch(apiUrl,options)
            const data=await res.json()
            if (data.success==false){
                dispatch(signInFailure(data.message))
                return;
            }
            displath(signInSuccess(data))
            navigate("/")
        }
        catch(Error){
            dispatch(signInFailure(Error.message))
        }
    }

    return (
        <div>
            <h1>SignIn</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="email" id="email" onChange={handleChange}/>
                <input type="password" placeholder="password" id="password" onChange={handleChange}/>
                <button disabled={loading}>{loading?'Loading...':'SignIn'}</button>
                <Oauth/>
                <p>{error}</p>
            </form>
            <p>Dont have an account</p>
            <Link to="/sign-up">
            <span>sign-up</span>
            </Link>
        </div>
    )
}
