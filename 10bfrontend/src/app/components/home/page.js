"use client";
export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link"
import {useState,useEffect} from "react";
import { useRouter } from "next/navigation";



function CanGetPasscode(problems)
{
  const now = new Date();
  return problems.length > 0 && problems.every(
    new Date(p.dueDate) >= now
  );
}

export default function Home() 
{
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topTopics, setTopTopics] = useState([]);
  const[assignedProblems, setAssignedProblems] = useState([]);
  const netid = typeof window !== "undefined" ? localStorage.getItem('netid') : null;
  const userName = typeof window !== "undefined" ? localStorage.getItem('name') : null;
  const topics = [
    { name: "Warm up 1", color: "bg-emerald-300", description: "Get started by warming up!", route: "easy"},
    { name: "Warm up 2", color: "bg-emerald-300", description: "More warm up problems to challenge yourself", route: "easy" },
    { name: "File Streams 1", color: "bg-emerald-300", description: "Practice Stream Concepts", route: "choices" },
    { name: "Arrays and Strings", color: "bg-emerald-300", description: "Array problems", route: "choices" },
    { name: "Classes 1", color: "bg-amber-300", description: "Basic problems on classes", route: "choices" },
    { name: "Classes 2", color: "bg-amber-300", description: "More classes problem to challenge yourself!", route: "choices" },
    { name: "Inheritance and Polymorphism", color: "bg-amber-300", description: "Test your OOPS!", route: "choices"},
    { name: "Recursion", color: "bg-amber-300", description: "Dive deeper on solving recursive problems!", route: "choices" },
    { name: "Search and Sorting", color: "bg-orange-600", description: "Basic DSA Problems", route: "choices" },
    { name: "Stacks and Queues", color: "bg-orange-600", description: "More DSA to challenge yourself", route: "choices" },
    { name: "Linked List 1", color: "bg-orange-600", description: "Basic Linked List for getting started", route: "choices"},
    { name: "Linked List 2", color: "bg-orange-600", description: "More Linked List problems to challenge yourself!", route: "choices" },
  ];
  const progressColors = ["green-300", "red-300", "blue-300", "yellow-300", "indigo-300"]

  useEffect(() => {
    const netid = typeof window !== "undefined" ? localStorage.getItem('netid') : null;
    if (!netid) {
      router.replace("/");
    }
  }, [router]);
  useEffect(() => {
    const fetchRankings = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress/ranks?netId=${netid}`);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/assigned?netId=${netid}`);
      if(res.ok)
      {
        const data = await res.json();
        const today = new Date();
        today.setHours(0,0,0,0);
        const activeProblems = data.filter(p => 
        {
          const [year, month, day] = p.dueDate.split('-').map(Number);
          const dueDate = new Date(year, month - 1, day, 23, 59, 59, 999);
          return dueDate >= new Date();
        });
        setAssignedProblems(activeProblems);
      }
    };
    fetchAssigned();
  },[]);

  return (
    <div className="min-h-screen w-full font-sans bg-gradient-to-r from-gray-700 via-gray-900 to-gray-800">
      <nav className="bg-black shadow-lg">
        <div className="flex flex-wrap justify-between items-center p-4">
          <div className="flex space-x-4">
            <Link href="/components/home" className="text-blue-300 hover:text-white text-lg font-semibold transition-all transform hover:scale-110">
              Home
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('netid');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                router.replace('/');
              }}
              className="text-blue-300 hover:text-white text-lg font-semibold transition-all cursor-pointer transform hover:scale-110"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="grid grid-cols-4 gap-6 px-8 py-6">
        {topics.map((topic, index) => {
          const isWarmUp = topic.name.toLowerCase().includes("warm up");
          const href = isWarmUp
            ? `/components/problems?topic=${encodeURIComponent(topic.name)}&difficulty=Easy`
            : `/components/${topic.route}?topic=${encodeURIComponent(topic.name)}`;
          return (
            <Link
              key={index}
              href={href}
              className={`block ${topic.color} rounded-xl shadow-lg p-6 hover:scale-105 transition-all cursor-pointer`}
              onClick={() => setSelectedTopic(topic.name)}
            >
              <h1 className="mb-2 text-xl font-bold tracking-tight text-gray-900">{topic.name}</h1>
              <div className="font-normal text-sm text-gray-800">{topic.description}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-8 px-8 py-6">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl text-rose-400 mb-3 font-bold">Top 5 Topics</h3>
          {topTopics.map((topic, index) => (
            <div key={index}>
              <div className={`mb-2 font-medium text-${progressColors[index]}`}>
                {topic.topic}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-5 mb-4">
                <div
                  className={`bg-${progressColors[index]} text-sm font-medium text-white p-1 text-center leading-none h-5 rounded-full`}
                  style={{ width: `${Math.round(topic.strength)}%` }}
                >
                  {Math.round(topic.strength)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg mb-3 font-bold text-blue-300">Assignments Bulletin Board</h3>
          <div className="text-blue-300 text-lg font-semibold">
            Welcome, {userName || netid}!
          </div>
          <div className="p-4 bg-black rounded-xl border-l-4 border-l-rose-400 shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-200">Assigned Problems</span>
            </div>
            <ul className="space-y-2">
              {assignedProblems.length === 0 ? (
                <li className="text-gray-400">No assigned yet! But it doesn&apos;t hurt to practice right?</li>
              ) : (
                assignedProblems.map((problem, index) => (
                  <li key={index} className="mb-2 flex justify-between items-center bg-gray-900 rounded px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={problem.completed}
                        readOnly
                        className={`form-checkbox h-5 w-5 ${problem.completed ? "text-green-500" : "text-rose-400"} border-gray-400`}
                      />
                      <span className={`text-lg ${problem.completed ? "line-through text-gray-400" : "text-white"}`}>
                        Finish the {problem.problem} problem
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded">
                        Due: {problem.dueDate ? (() => {
                            const [year, month, day] = problem.dueDate.split('-').map(Number);
                            const localDate = new Date(year, month - 1, day, 23, 59, 59, 999);
                            return localDate.toLocaleDateString();
                          })()
                        : "TBA"}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
      <footer className="w-full mt-8 mb-4 px-4 rounded-lg shadow-lg bg-gray-900 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 py-4">
          <Link href="#" className="text-blue-300 hover:text-white cursor-pointer font-semibold transition-all transform hover:scale-110">Home</Link >
          <span className="text-gray-500">|</span>
          <Link href="#" className="text-blue-300 hover:text-white cursor-pointer font-semibold transition-all transform hover:scale-110">Contact</Link >
        </div>
        <div className="text-center text-gray-500 text-xs pb-2">&copy; 2025 CodeTrack</div>
      </footer>
    </div>

  );
}
