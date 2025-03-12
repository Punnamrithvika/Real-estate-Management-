import React from "react";
import { useSelector } from "react-redux";
import {useRef} from 'react'
import { useState } from "react";
import { updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutUserStart,signoutUserSuccess,signoutUserFailure} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
export default function Profile(){
    const {currentUser,loading}=useSelector(state=>state.user)
    const dispatch=useDispatch()
    const fileRef=useRef(null)
    const [formData,setFormData]=useState({})
    const [updateSuccess,setUpdateSuccess]=useState(false)
    const [showListingError,setShowListingError]=useState(false)
    const [userListing,setUserListing]=useState([])
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value})
    }
    const onSubmitForm=async (e)=>{
        e.preventDefault()
        try{
            dispatch(updateUserStart())
            const apiUrl=`/api/user/update/${currentUser._id}1`
            const options={
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(formData)
            }
            const res=await fetch(apiUrl,options)
            const data=await res.json()
            if (data.success){
                dispatch(updateUserFailure(data.message))
                return
            }
            dispatch(updateUserSuccess(data))
            setUpdateSuccess(true)
        }
        catch(error){
            dispatch(updateUserFailure(error.message))
        }
    }

    const onHandleDelete=async ()=>{
        try{
            dispatch(deleteUserStart)
            const apiUrl=`/api/user/delete/${currentUser._id}`
            const options={
                method:"DELETE",

            }
            const res=await fetch(apiUrl,options)
            const data=await res.json()
            if (data.success===false){
                dispatch(deleteUserFailure(data.message))
                return
            }
            dispatch(deleteUserSuccess(data))
        }
        catch(error){
            dispatch(deleteUserFailure(error.message))
        }
    }

    const onHandleSignout=async (e)=>{
        e.preventDefault()
        try{
            dispatch(signoutUserStart())
            const res=await fetch("/api/auth/signout")
            const data=await res.json()
            if (data.success==false){
                dispatch(signoutUserFailure(data.message))
            }
            else{
                dispatch(signoutUserSuccess(data))
            }
        }
        catch(error){
            dispatch(signoutUserFailure(error.message))
        }
    }

    const handleShowListings=async ()=>{
        try{
            setShowListingError(false);
            const res=await fetch(`/api/user/listing/${currentUser._id}`)  
            const data=await res.json()
            if (data.success===false){
                setShowListingError(true);
                return
            } 
            setShowListingError(false); 
            setUserListing(data)
        }
        catch(error){
            setShowListingError(true)
        }
    }
    return (
         <div>
            <h1>Profile</h1>
            <form onSubmit={onSubmitForm}>
                <input type="file" ref={fileRef} hidden/>
                <img onClick={()=>fileRef.current.click()} alt="avatar" src={currentUser.avatar} accept="image" className="h-24 w-24"/>
                <input type="text" id="username" placeholder="username" defaultValue={currentUser.username} onChange={handleChange}/>
                <input type="text" id="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange}/>
                <input type="password" id="password" placeholder="password" defaultValue={currentUser.password} onChange={handleChange}/>
                <button>{loading?'loading':'update'}</button>
            </form>
            <Link to={"/create-listing"}>
             Create Listing
            </Link>
            <span onClick={onHandleDelete}>Delete Account</span>
            <span onClick={onHandleSignout}>Sign Out</span>
            {updateSuccess && <p>User Updated Successfully</p>}
            <button type="button" onClick={handleShowListings}>Show Listings</button>
            <p>{showListingError?'Error occured':''}</p>
             {userListing.length>0 && userListing.map((listing)=>(
                <div>
                    <Link to={`/listing/${listing._id}`}>
                    <img src={listing.imageUrls[0]} alt="home"/>
                    </Link>
                    </div>
             ))}
         </div>
    )
}