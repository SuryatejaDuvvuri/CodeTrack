"use client";
import {useState, useEffect} from "react";

function Signup()
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
        <form onSubmit = {handleSubmit}>
            <h2>Sign up</h2>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@ucr.edu" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Sign Up</button>
                <div>{msg}</div>
        </form>
    )
}