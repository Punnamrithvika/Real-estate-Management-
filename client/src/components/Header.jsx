import React from "react";
import {FaSearch} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import { useSelector } from "react-redux";
export default function Header(){
    const {currentUser}=useSelector(state=>state.user)
    return (
        <>
        <div className="flex justify-between item-center mx-auto"> 
            <Link to="/">
        <h1 className="font-bold">
            <span className="text-blue-500">Raj</span>
            <span className="text-blue-700">Estate</span>
        </h1>
        </Link>
        <form>
            <input type="text" placeholder="Search..."/>
            <FaSearch/>
        </form>
        <ul>
            <Link to="/"> 
            <li>Home</li>
            </Link>
            <Link to="/about"> 
            <li>About</li>
            </Link>
            <Link to="/sign-in"> 
             {!currentUser?(<li>SignIn</li>):(<img alt="avatar" src={currentUser.avatar} className="h-7 w-7"/>)}
            </Link>
        </ul>
        </div>
        </>
    )
}