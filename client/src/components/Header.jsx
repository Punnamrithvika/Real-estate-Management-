import React from "react";
import {FaSearch} from 'react-icons/fa'
import {Link} from 'react-router-dom'
export default function Header(){
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
            <li>SignIn</li>
            </Link>
        </ul>
        </div>
        </>
    )
}