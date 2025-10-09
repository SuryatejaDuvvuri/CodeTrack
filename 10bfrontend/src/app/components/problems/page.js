"use client";
import {useState,useEffect} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProblemList()
{

    const search = useSearchParams();
    const topic = search.get("topic");
    const difficulty = search.get("difficulty");
    const [progress, setProgress] = useState(0);
    
    // const [problems, setProblems] = useState([]);
    
    var color = "bg-emerald-400";

    if(difficulty === "Medium")
    {
        color = "bg-amber-400";
    }
    else if(difficulty === "Hard")
    {
        color = "bg-orange-600";
    }

    useEffect(() => {
      const netid = typeof window !== "undefined" ? localStorage.getItem('netid') : null;
      const fetchProgress = async () => {
            const res = await fetch(`http://localhost:8080/api/progress/getTotal?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&netId=${netid}`);
            if(res.ok)
            {
                const data = await res.json();
                setProgress(data);
            }
        };
        fetchProgress();  
    }, [topic,difficulty]);

    // useEffect(() => {
    //     const fetchProblems = async () => {
    //         const res = await fetch(`http://localhost:8080/api/chat/problems?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}`);
    //         if (res.ok) 
    //         {
    //             const data = await res.json();
    //             console.log(data);
    //             setProblems(data); 
    //         }
    //     };
    //     fetchProblems();
    // }, [topic, difficulty]);
    


    const problems = [];
    for (let i = 1; i <= 5; i++) 
    {
        problems.push(`${difficulty} ${i}`);
    }

    return (
        <div className="container mx-auto min h-screen font-sans m-4 flex flex-col justify-center items-center">
            <nav className = "bg-black">
                    <div className = "flex flex-wrap justify-between items-center p-4">
                    <div className="flex space-x-4">
                        {/* <a href = "#" className = "text-white hover:text-lg transition-all">Profile</a> */}
                        <a href = "/" className = "text-white hover:text-lg transition-all">Home</a>
                        <a onClick = {() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              window.location.href = '/components/login';}}className = "text-white hover:text-lg transition-all">Logout</a>
                    </div>
                    </div>
            
                </nav>
            <div className = "grid grid-cols-3 gap-4 mb-auto">
                {problems.map((problem,index) => (
                    <Link key = {index} className = {`block ${color} rounded-lg shadow-sm p-6 hover:scale-110 transition-all`}
                    href = {`/components/problem?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(problem)}`}>
                        <h1 className="mb-2 text-xl font-bold tracking-tight">{problem}</h1>
                        <div className="font-normal text-sm">This is a description of a problem</div>
                    </Link>
                ))}
            </div>

            <div className = "mb-2 font-medium text-gray-500">
                    Progress Completed
            </div>
            <div className = "w-full bg-gray-700 rounded-full h-5 mb-4">
                <div className = "bg-cyan-400 text-sm font-medium text-white p-1 text-center leading-none h-5 rounded-full" style={{width:`${progress}%`}}>{progress}%</div>
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