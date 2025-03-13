import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice.js";
import Oauth from "../components/Oauth.jsx";

export default function SignIn() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signInStart());
        try {
            const apiUrl = "/api/auth/signin";
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            };
            const res = await fetch(apiUrl, options);
            const data = await res.json();

            if (data.success === false) {
                dispatch(signInFailure(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-center text-gray-700">Sign In</h1>
                <form onSubmit={handleSubmit} className="mt-4">
                    <input 
                        type="text" 
                        placeholder="Email" 
                        id="email" 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        id="password" 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <button 
                        disabled={loading} 
                        className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? "Loading..." : "Sign In"}
                    </button>
                    <Oauth />
                    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account? 
                    <Link to="/sign-up" className="text-blue-500 hover:underline"> Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
