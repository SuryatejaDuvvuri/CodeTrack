"use client";
import {useState, useEffect} from "react";

export default function Signup()
{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:8080/api/auth/signup",{
         method: "POST",
         headers: {'Content-Type':'application/json'},
         body: JSON.stringify({Email:email,Password:password,Name:name}),   
        });
        const text = await res.text();
        setMsg(text);
    }

    return (
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-700 via-gray-900 to-gray-800 font-sans">
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 w-full max-w-md space-y-6">
                <h2 className="text-3xl font-bold text-blue-300 mb-4 text-center">Sign up</h2>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@ucr.edu"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="w-full bg-gray-600 text-blue-200 hover:bg-rose-400 text-white font-semibold py-2 rounded-lg shadow transition-all transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-400"
                >
                    Sign Up
                </button>
                
                <div className="text-center text-red-400">{msg}</div>
            </form>
        </div>
    )
}