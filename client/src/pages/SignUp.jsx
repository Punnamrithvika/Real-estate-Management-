import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = "/api/auth/signup";
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            };
            const res = await fetch(apiUrl, options);
            const data = await res.json();
            if (data.success === false) {
                setError(data.message);
                setLoading(false);
            } else {
                setError("");
                setLoading(false);
                navigate("/sign-in");
            }
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        id="username" 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                        type="text" 
                        placeholder="Email" 
                        id="email" 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        id="password" 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        disabled={loading} 
                        className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Sign Up"}
                    </button>
                    <Oauth />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </form>
                <p className="text-center mt-4">
                    Have an account? 
                    <Link to="/sign-in" className="text-blue-500 hover:underline ml-1">Sign In</Link>
                </p>
            </div>
        </div>
    );
}