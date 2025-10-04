"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({Email:email, Password:password}),
    });

    if(res.ok)
    {
      const {token,role} = await res.json();
      localStorage.setItem('token',token);
      localStorage.setItem('role',role);
      const netid = email.split('@')[0];
      localStorage.setItem('netid', netid);
      if (role === "INSTRUCTOR")
      {
        router.push("/components/instructor");
      }
      else
      {
          router.push("/");
      }
    }
    else
    {
      setMsg("Invalid credentials");
    }
  }

  return (
    <div className="container flex flex-col m-auto min h-screen px-4 font-sans justify-center items-center">
        <div className = "mb-8">
          <h1 className = "text-xl font-bold text-white">CS010B Practice Portal</h1>
        </div>

        <div className = "rounded-xl p-8 w-full">
          <h2 className = "text-2xl font-semibold text-white text-center">Welcome!</h2>
          <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@ucr.edu"
                required
                className="w-full px-4 py-2 rounded bg-gray-800 text-white"
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-2 rounded bg-gray-800 text-white"
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-sm w-full">
                Login
              </button>
              <div className = "space-y-4">
          </div>
              <div className="text-red-400">{msg}</div>
          </form>

          <div className = "flex items-center justify-center w-full mt-5">
               <button onClick = {router.push('/components/signup')}className = "bg-blue-600 mb-auto text-white px-6 py-3 rounded-lg shadow-sm hover:font-bold">
                Sign up
              </button>
          </div>
           {/* <div className = "grid grid-rows-1 gap-4">
                <div className = "flex items-center mx-4">
                  <div className = "flex-grow border-t border-gray-600"></div>
                      <span className = "px-3 text-gray-400 text-sm">Continue as</span>
                      <div className = "flex-grow border-t border-gray-600"></div>
                </div>
                 <Link href = "/components/instructor" className = "text-white mb-auto px-6 py-3 rounded-lg shadow-sm bg-gray-700">
                      Instructor
                </Link>
                <Link href = "/" className = "text-white mb-auto px-6 py-3 rounded-lg shadow-sm bg-gray-700">
                      Student
                </Link>
            </div> */}
        </div>
       
      
       <footer className = "w-full mt-8 mb-4 px-4 rounded-lg shadow-sm">
        <div className = "flex justify-center space-x-4">
          <a href = "#" className = "text-gray-300">Home</a>
          <a href = "#" className = "text-gray-300">About</a>
          <a href = "#" className = "text-gray-300">Contact</a>
          
        </div>
        <div className=  "mt-4 text-gray-500 text-sm">
          &copy; 2025 CS010B Practice Portal. Made with Love
        </div>
     </footer>
      
    </div>

  );
}
