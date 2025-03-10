import React, { use } from "react";
import {Link} from 'react-router-dom'
import {useState} from 'react'
import { set } from "mongoose";
import { useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";
export default function SignUp(){
    const [formData,setFormData]=useState({
        username: "",
        email: "",
        password: ""
    })
    const [error,setError]=useState("")
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate()
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.id]:e.target.value
        })
    }

    const handleSubmit=async (e)=>{
        e.preventDefault()
        setLoading(true)
        try{
            const apiUrl="/api/auth/signup"
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
                setError(data.message)
                setLoading(false)
            }
            else{
                setError("")
                setLoading(false)
                navigate("/sign-in")
            }
        }
        catch(Error){
            setError(Error.message)
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>SignUp</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" id="username" onChange={handleChange}/>
                <input type="text" placeholder="email" id="email" onChange={handleChange}/>
                <input type="password" placeholder="password" id="password" onChange={handleChange}/>
                <button disabled={loading}>{loading?'Loading...':'SignUp'}</button>
                <Oauth/>
                <p>{error}</p>
            </form>
            <p>Have an account</p>
            <Link to="/sign-in">
            <span>sign-in</span>
            </Link>
        </div>
    )
}