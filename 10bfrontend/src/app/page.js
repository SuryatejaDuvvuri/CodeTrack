"use client";
import Image from "next/image";
import Link from "next/link"
import {useState,useEffect} from "react";
import { useRouter } from "next/navigation";



function canGetPasscode(problems)
{
  const now = new Date();
  return problems.length > 0 && problems.every(
    p => p.completed && new Date(p.dueDate) >= now
  );
}

export default function Home() 
{
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topTopics, setTopTopics] = useState([]);
  const[assignedProblems, setAssignedProblems] = useState([]);
  const netid = typeof window !== "undefined" ? localStorage.getItem('netid') : null;
  const topics = [
    { name: "Warm up 1", color: "bg-emerald-400", description: "Get started by warming up!", route: "easy"},
    { name: "Warm up 2", color: "bg-emerald-400", description: "More warm up problems to challenge yourself", route: "easy" },
    { name: "File Streams 1", color: "bg-emerald-400", description: "Practice Stream Concepts", route: "choices" },
    { name: "Arrays and Strings", color: "bg-emerald-400", description: "Array problems", route: "choices" },
    { name: "Classes 1", color: "bg-amber-400", description: "Basic problems on classes", route: "choices" },
    { name: "Classes 2", color: "bg-amber-400", description: "More classes problem to challenge yourself!", route: "choices" },
    { name: "Inheritance and Polymorphism", color: "bg-amber-400", description: "Test your OOPS!", route: "choices"},
    { name: "Recursion", color: "bg-amber-400", description: "Dive deeper on solving recursive problems!", route: "choices" },
    { name: "Search and Sorting", color: "bg-orange-600", description: "Basic DSA Problems", route: "choices" },
    { name: "Stacks and Queues", color: "bg-orange-600", description: "More DSA to challenge yourself", route: "choices" },
    { name: "Linked List 1", color: "bg-orange-600", description: "Basic Linked List for getting started", route: "choices"},
    { name: "Linked List 2", color: "bg-orange-600", description: "More Linked List problems to challenge yourself!", route: "choices" },
  ];
  const progressColors = ["green-300", "red-300", "blue-300", "yellow-300", "indigo-300"]

  useEffect(() => {
    const netid = typeof window !== "undefined" ? localStorage.getItem('netid') : null;
    if (!netid) {
      router.replace("/components/login");
    }
  }, [router]);
  useEffect(() => {
    const fetchRankings = async () => {
      const res = await fetch(`http://localhost:8080/api/progress/ranks?netId=${netid}`);
      if(res.ok)
      {
        const data = await res.json();
        setTopTopics(data.slice(0,5));
      }
    };
    fetchRankings();
  },[]);

  useEffect(() => {
    const fetchAssigned= async () => {
      const res = await fetch(`http://localhost:8080/api/chat/assigned?netId=${netid}`);
      if(res.ok)
      {
        const data = await res.json();
        setAssignedProblems(data);
      }
    };
    fetchAssigned();
  },[]);

  return (
    <div className="container mx-auto min h-screen font-sans m-4">
      <nav className = "bg-black space-y-3 mb-4">
        <div className = "flex flex-wrap justify-between items-center p-4">
          <div className="flex space-x-4">
            {/* <a href = "#" className = "text-white hover:text-lg transition-all">Profile</a> */}
            <a href = "/components/login" className = "text-white hover:text-lg transition-all cursor-pointer">Home</a>
            <button onClick = {() => {
              localStorage.removeItem('netid');
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              router.replace('/components/login');}} className = "text-white hover:text-lg transition-all cursor-pointer">Logout</button>
          </div>
        </div>
      </nav>
      <div className = "grid grid-cols-4 gap-6 mb-auto">
        {topics.map((topic,index) => {
          const isWarmUp = topic.name.toLowerCase().includes("warm up");
          const href = isWarmUp
            ? `/components/problems?topic=${encodeURIComponent(topic.name)}&difficulty=Easy`
            : `/components/${topic.route}?topic=${encodeURIComponent(topic.name)}`;
          return (
            <Link key = {index} href = {href}
            className = {`block ${topic.color} rounded-lg shadow-sm p-6 hover:scale-110 transition-all`}
            onClick = {() => setSelectedTopic(topic.name)}>
              <h1 className=  "mb-2 text-xl font-bold tracking-tight">{topic.name}</h1>
              <div className = "font-normal text-sm">{topic.description}</div>
            </Link>
          );
        })}
      </div>

      <div className = "container mx-auto grid grid-cols-2 gap-6 mb-auto mt-4">
        <div className = "block flex-1 mb-auto">
          <h3 className = "text-xl text-rose-400 mb-3">Top 5 Topics</h3>
          {topTopics.map((topic,index) => (
            <div key = {index}>
              <div className = {`mb-2 font-medium text-${progressColors[index]}`}>
                {topic.topic}
              </div>
              <div className = "w-full bg-gray-700 rounded-full h-5 mb-4">
                  <div className = {`bg-${progressColors[index]} text-sm font-medium text-white p-1 text-center leading-none h-5 rounded-full`} style={{width:`${Math.round(topic.strength)}%`}}>{Math.round(topic.strength)}%</div>
              </div>
            </div>
          ))}
         
        </div>
        <div className="flex-1 block p-4 rounded-lg shadow-sm">
          <h3 className = "text-lg mb-3 font-bold">Assignments bulletin board</h3>
          <div className = "p-2 bg-black rounded border-l-4 border-l-emerald-300 shadow-sm">
            <div className = "flex justify-between items-center">
              <span className = "font-medium mb-4">Assigned Problems</span>
            </div>
            <ul className = "space-y-2">
             {assignedProblems.length === 0 ? (
              <li className = "text-gray-400">No assigned yet! But it doesn't hurt to practice right?</li>
             ) : (
              assignedProblems.map((problem,index) => (
                <li key = {index} className = "mb-2 flex justify-between items-center bg-gray-800 rounded px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={problem.completed}
                        readOnly
                        className={`form-checkbox h-5 w-5 ${problem.completed ? "text-green-500" : "text-red-500"} border-gray-400`}
                    />
                    <span className = {`text-lg ${problem.completed ? "line-through text-gray-400" : "text-white"}`}>
                      Finish the {problem.problem} problem
                    </span>
                  </div>
                  <div className = "flex items-center space-x-2">
                    <span className = "text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded">
                      Due: {problem.dueDate ? new Date(problem.dueDate).toLocaleDateString() : "TBA"}
                    </span>
                  </div>
                </li>
              ))
             )}
            </ul>
          </div>
          
          {/* <button disabled={!canGetPasscode(assignedProblems)} className = "text-md mt-4 bg-gray-400 px-4 py-2 rounded disabled:opacity-50">
            Get Passcode
          </button> */}
        </div>
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
