"use client";
import Image from "next/image";
import Link from "next/link"
import {useState,useEffect} from "react";

export default function Home() 
{
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topTopics, setTopTopics] = useState([]);
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
    const fetchRankings = async () => {
      const res = await fetch('http://localhost:8080/api/progress/ranks?netId=sduvv003');
      if(res.ok)
      {
        const data = await res.json();
        setTopTopics(data.slice(0,5));
      }
    };
    fetchRankings();
  },[]);

  return (
    <div className="container mx-auto min h-screen font-sans m-4 flex flex-col justify-center items-center">
      <nav className = "bg-black">
        <div className = "flex flex-wrap justify-between items-center p-4">
          <div className="flex space-x-4">
            <a href = "#" className = "text-white hover:text-lg transition-all">Profile</a>
            <a href = "/" className = "text-white hover:text-lg transition-all">Home</a>
            <button className = "text-white hover:text-lg transition-all">Logout</button>
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
          {/* <div className = "mb-2 font-medium text-green-300">
            Linked List
          </div>
          <div className = "w-full bg-gray-700 rounded-full h-5 mb-4">
            <div className = "bg-green-300 text-sm font-medium text-white p-1 text-center leading-none h-5 rounded-full" style={{width:"60%"}}>60%</div>
          </div>
          <div className = "mb-2 font-medium text-red-300">
            Arrays
          </div>
          <div className = "w-full bg-gray-700 rounded-full h-5 mb-4">
            <div className = "bg-red-300 text-sm font-medium text-white p-1 text-center leading-none h-5 rounded-full" style={{width:"50%"}}>50%</div>
          </div>
          <div className = "mb-2 font-medium text-blue-300">
            Strings
          </div>
          <div className = "w-full bg-gray-700 rounded-full h-5 mb-4">
            <div className = "bg-blue-300 text-sm font-medium text-white p-1 text-center leading-none h-5 rounded-full" style={{width:"43%"}}>43%</div>
          </div>
          <div className = "mb-2 font-medium text-yellow-300">
            Pointers
          </div>
          <div className = "w-full bg-gray-700 rounded-full h-5 mb-4">
            <div className = "bg-yellow-300 text-sm font-medium text-white p-1 text-center leading-none h-5 rounded-full" style={{width:"25%"}}>25%</div>
          </div>
          <div className = "mb-2 font-medium text-emerald-300">
            Recursion
          </div>
          <div className = "w-full bg-gray-700 rounded-full h-5 mb-4">
            <div className = "bg-emerald-300 text-sm font-medium text-white p-1 text-center leading-none h-5 rounded-full" style={{width:"20%"}}>20%</div>
          </div> */}
        </div>
        <div className="flex-1 block p-4 rounded-lg border-2 border-amber-300 shadow-sm">
          <h3 className = "text-lg mb-3 font-bold">Assignments bulletin board</h3>
          <div className = "p-2 bg-black rounded border-l-4 border-l-blue-500 shadow-sm">
            <div className = "flex justify-between items-center">
              <span className = "font-medium">Linked List Problems</span>
              <span className = "text-xs bg-red-300 text-red-800 px-2 py-1 rounded">Due: September 22nd, 2025</span>
            </div>
            <ul>
              <li>Finish 5 easy problems</li>
              <li>Finish 2 medium problems</li>
              <li>Finish 1 hard problem</li>
            </ul>
          </div>
          
          <button disabled className = "text-md mt-4 bg-gray-400 px-4 py-2 rounded disabled:opacity-50">
            Get Passcode
          </button>
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
