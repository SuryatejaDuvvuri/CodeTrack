"use client";
import Image from "next/image";
import Link from "next/link"
import { useSearchParams } from "next/navigation";
export default function Easy() {
  const search = useSearchParams();
  const topic = search.get("topic");
  const netid = localStorage.getItem('netid');
  return (
    <div className="container mx-auto min h-screen font-sans m-4 flex flex-col justify-center items-center">
      <nav className = "bg-black">
        <div className = "flex flex-wrap justify-between items-center p-4">
          <div className="flex space-x-4">
            <a href = "#" className = "text-white hover:text-lg transition-all">Profile</a>
            <a href = "/" className = "text-white hover:text-lg transition-all">Home</a>
            <a nClick = {() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              window.location.href = '/components/login';}} className = "text-white hover:text-lg transition-all">Logout</a>
          </div>
        </div>

      </nav>
      <div className = "grid grid-cols-3 gap-4 mb-auto">
        <Link className = "block bg-emerald-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = {`/components/problems?topic=${encodeURIComponent(topic)}&difficulty=Easy`}>
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Easy</h1>
          <div className = "font-normal text-sm">Start off with ease!</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = {`/components/problems?topic=${encodeURIComponent(topic)}&difficulty=Medium`}>
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium</h1>
          <div className = "font-normal text-sm">You think that's easy? Try this!</div>
        </Link>
        <Link className = "block bg-orange-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = {`/components/problems?topic=${encodeURIComponent(topic)}&difficulty=Hard`}>
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Hard</h1>
          <div className = "font-normal text-sm">Still think this is easy? Try me!</div>
        </Link>
              
      </div>

       <footer className = "w-full mt-8 mb-4 px-4 rounded-lg shadow-sm">
        <div className = "flex justify-center space-x-4">
          <a href = "#" className = "text-gray-300">Home</a>
          <a href = "#" className = "text-gray-300">Contact</a>
          
        </div>
     </footer>
      
    </div>

  );
}
