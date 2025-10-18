"use client";
export const dynamic = 'force-dynamic';
import {useState,useEffect} from "react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Problems()
{
    const search = useSearchParams();
    const topic = search.get("topic");
    const difficulty = search.get("difficulty");
    const [progress, setProgress] = useState(0);
    const [problemsList, setProblemsList] = useState([]);
    
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

    useEffect(() => {
        const fetchProblems = async () => {
            const res = await fetch(`http://localhost:8080/api/chat/problems?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}`);
            if (res.ok) 
            {
                const data = await res.json();
                console.log(data);
                setProblemsList(data); 
            }
        };
        fetchProblems();
    }, [topic, difficulty]);
    


    const problems = [];
    for (let i = 1; i <= 5; i++) 
    {
        problems.push(`${difficulty} ${i}`);
    }

    return (
        <div className="min-h-screen w-full font-sans flex flex-col bg-gradient-to-r from-gray-700 via-gray-900 to-gray-800">
            <nav className="bg-black shadow w-full">
                <div className="flex flex-wrap justify-between items-center p-2">
                    <div className="flex space-x-4">
                        <a href="/" className="text-blue-300 hover:text-white text-lg font-semibold transition-all transform hover:scale-110">
                            Home
                        </a>
                        <a
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('role');
                                window.location.href = '/';
                            }}
                            className="text-blue-300 hover:text-white text-lg font-semibold transition-all cursor-pointer transform hover:scale-110"
                        >
                            Logout
                        </a>
                    </div>
                </div>
            </nav>
            <main className="flex-1 flex flex-col justify-center items-center w-full">
                <div className="grid grid-cols-3 gap-6 py-10 px-8 w-full max-w-6xl">
                    {problemsList.slice(0, 5).map((problem, index) => (
                        <Link
                            key={index}
                            className={`block ${color} rounded-xl shadow-lg p-6 hover:scale-105 transition-all cursor-pointer`}
                            href={`/components/problem?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(problem.id)}`}
                        >
                            <h1 className="mb-2 text-xl font-bold tracking-tight text-gray-800">{problem.Name}</h1>
                            <div className="font-normal text-sm line-clamp-2 text-black">
                                {problem.Description}
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mb-2 font-medium text-blue-300 text-xl">
                    Progress Completed
                </div>
                <div className="w-full max-w-2xl bg-gray-700 rounded-full h-5 mb-4">
                    <div className="bg-cyan-400 text-sm font-medium text-white p-1 text-center leading-none h-5 rounded-full" style={{width:`${progress}%`}}>
                        {progress}%
                    </div>
                </div>
            </main>
            <footer className="w-full px-4 rounded bg-gray-900 border-t border-gray-800 shadow">
                <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 py-2">
                    <a href="#" className="text-blue-300 hover:text-white cursor-pointer font-semibold transition-all transform hover:scale-110">Home</a>
                    <span className="text-gray-500">|</span>
                    <a href="#" className="text-blue-300 hover:text-white cursor-pointer font-semibold transition-all transform hover:scale-110">Contact</a>
                </div>
                <div className="text-center text-gray-500 text-xs pb-1">&copy; 2025 CodeTrack</div>
            </footer>
        </div>
    );
}

export default function ProblemList()
{
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-300">Loading...</div>}>
            <Problems/>
        </Suspense>
    );
}