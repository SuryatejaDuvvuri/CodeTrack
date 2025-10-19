"use client";
export const dynamic = 'force-dynamic';
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
  localStorage.removeItem('netid');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({Email:email, Password:password}),
    });

    if(res.ok)
    {
      const {token,role,name} = await res.json();
      localStorage.setItem('token',token);
      localStorage.setItem('role',role);
      localStorage.setItem('name', name); 
      const netid = email.split('@')[0];
      localStorage.setItem('netid', netid);
      if (role === "INSTRUCTOR")
      {
        router.push("/components/instructor");
      }
      else
      {
          router.push("/components/home");
      }
    }
    else
    {
      setMsg("Invalid credentials");
    }
  }

  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-700 via-gray-900 to-gray-800 font-sans">
      <div className="w-full max-w-md bg-gray-950 rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-sky-300 mb-2">CodeTrack Portal</h1>
          <p className="text-gray-200">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-200 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@ucr.edu"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-rose-400 text-white font-semibold py-2 rounded-lg shadow transition-all"
          >
            Login
          </button>
          {msg && <div className="text-red-400 text-center">{msg}</div>}
        </form>
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={() => router.push('/components/signup')}
            className="bg-gray-800 hover:bg-rose-400 px-6 py-2 rounded-lg shadow-sm font-medium transition-all"
          >
            Sign up
          </button>
        </div>
        <footer className="mt-8 text-center text-gray-400 text-sm">
          &copy; 2025 CodeTrack. Made with Love
        </footer>
      </div>
    </div>

  );
}
