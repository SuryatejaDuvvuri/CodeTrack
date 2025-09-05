'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link"
import CodeEditor from './codeEditor.js'
import ProgressGraph from "./progressGraph.js";
import ChatHistory from "./chatHistory.js";
// import EmbeddedViewer from "./EmbeddedViewer.js";

export default function Problem() 
{

  const [defaultCode, setDefaultCode] = useState("");
  const [testcases,setTestcases] = useState([]);
  const problem = "Easy 1";
  const start = async () => {
    const res = await fetch ("http://localhost:8080/api/chat/load?difficulty=easy&problem=easy 1")
    const wait = await res.text();
    setDefaultCode(wait);
  };
  
  useEffect(() => {
    start();
  }, []);

  const loadCode = async () => 
  {
    const res = await fetch(`http://localhost:8080/api/grade/code?netId=sduvv003&problem=${problem}`, {
      method: "GET",
      headers: {
        "Content-Type":"application/json"
      }
    });

    if(res.ok)
    {
      const data = await res.text();
      setCode(data);
    }
    else
    {
      setCode(defaultCode);
    }
  };

  const saveCode = async () =>
  {
      const chatRes = await fetch ("http://localhost:8080/api/grade/update", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({netId: "sduvv003", problem:problem, code: code}),
    });
  }

  const [code, setCode] = useState(loadCode);
  const [results, setResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const handleRun = async () =>
  {
    setLoading(true);
    const runStart = Date.now();
    const res = await fetch("http://localhost:8080/api/grade", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({netId: "sduvv003", problem:problem, code: code}),
    });
    const result = await res.json();
    const runEnd = Date.now();
    const timeSpent = startTime ? Math.round((runEnd - runStart) / 1000) : 0;
    setStartTime(null); 
    if(result.status === "error")
    {
        setMessages(prev => [
          ...prev,
          {role: "system",content:result.details}
        ]);
        setResults([]);
        setLoading(false);
        return;
    }
    else
    {
      setResults(result);
      
      const passed = result.filter(r => r.result === "PASS").length;
      const total = result.length;
      await fetch("http://localhost:8080/api/progress", {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          netId:"sduvv003",problem,passed,total,timeSpent
        })
      });

      fetchProgress();

    }

    const chatRes = await fetch ("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          prompt: "Can you give me feedback on my code?",
          problem: problem,
          netId: "sduvv003"
      }),
    });

    if(chatRes.ok)
    {
        const data = await chatRes.json();
        const res = 
        {
            role:'system',
            content:data.response,
            timestamp: new Date()
        };

        setMessages(prev => [...prev,res]);
        setLoading(false);
    }
  }

   useEffect(() => {
    const chatCont = document.querySelector('.overflow-y-auto');
    if(chatCont)
    {
      chatCont.scrollTop = chatCont.scrollHeight;
    }
  },[messages,isLoading]);

  const fetchProgress = async () => {
    const progressRes = await fetch(`http://localhost:8080/api/progress?netId=sduvv003&problem=${problem}`);

    if(progressRes.ok)
    {
      const data = await progressRes.json();
      setProgressData(data.map(run => ({
        timestamp:new Date(run.timestamp),
        success:run.successRate >= 80,
        duration: run.timeSpent,
        successRate:run.successRate
      })))
    }
  }

  useEffect(() => {
    if(showGraph)
    {
      fetchProgress();
    }
  }, [showGraph]);

  const toggle = () => 
  {
      setShowGraph(prev => !prev);
  }

  const handleResourceClick = (resource) => 
  {
    const embedUrl = `/embeddedviewer?url=${encodeURIComponent(resource.url)}&title=${encodeURIComponent(resource.name)}`;
    window.open(embedUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const totalAttempts = progressData.length;
  const avgTime = totalAttempts > 0 ? Math.round(progressData.reduce((a, b) => a + b.timeSpent, 0) / totalAttempts) : 0;
  const overallSuccess = totalAttempts > 0 ? Math.round(progressData.reduce((a, b) => a + (b.successRate >= 70 ? 1 : 0), 0) * 100 / totalAttempts) : 0;


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="w-full py-6 px-6 border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Prev
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Next
              </button>
              {/* <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                Random
              </button> */}
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-yellow-600 rounded-lg text-sm font-medium">
                Difficulty: 3/4
              </span>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-4 text-blue-400">
              Warm Up
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              The parameter weekdays is true if it is a weekday, 
              and the parameter vacation is true if we are on vacation. 
              We sleep in if it is not a weekday or we're on vacation. 
              Return true if we sleep in.
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-gray-200">Code Editor</h2>
              </div>
              <div className="p-4">
                <CodeEditor defaultCode = {defaultCode} code = {code} setCode = {setCode} handleRun = {handleRun} saveCode={saveCode} toggle={toggle} showGraph={showGraph} setStartTime={setStartTime}/>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Test Results</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-3 px-4 font-medium text-gray-300">Test Case</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-300">Input</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-300">Expected</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-300">Your Output</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {results.length > 0 ? (results.map((test, index) => (
                        <tr key={index} className="hover:bg-gray-700/50">
                          <td className="py-3 px-4">Case {index + 1}</td>
                          <td>{test.input}</td>
                          <td className="py-3 px-4 font-mono text-blue-400">{test.expectedOutput}</td>
                          <td className="py-3 px-4 font-mono text-gray-300">{test.userOutput}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              test.result === "PASS"
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-red-900 text-red-300'
                            }`}>
                              {test.result === "PASS" ? '✓ Pass' : '✗ Fail'}
                            </span>
                          </td>
                        </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-3 px-4 text-center text-gray-400">
                            Click Run to test your code and see results.
                          </td>
                        </tr>
                      )
                    }
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">AI Assistant</h3>
                <ChatHistory problem = {problem} messages = {messages} setMessages = {setMessages} isLoading = {isLoading} />
              </div>
            </div>
          </div>

         {showGraph && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-11 mb-6">
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">Progress Overview</h3>
                  <ProgressGraph attemptData = {progressData} totalAttempts={totalAttempts} avgTime = {avgTime} overallSuccess={overallSuccess}/>
              </div>
          )}

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Learning Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "C++ Reference", url: "https://www.w3schools.com/cpp/cpp_ref_reference.asp" },
                { name: "Zybooks", url: "https://learn.zybooks.com/zybook/UCRCS010BMillerSummer2025?selectedPanel=view-activity" },
                { name: "LearnCpp.com", url: "https://www.learncpp.com/" },
                { name: "Tutorial Videos", url: "https://www.youtube.com/watch?v=cec5DV42wjI&list=PLBlnK6fEyqRh6isJ01MBnbNpV3ZsktSyS&index=14" }
              ].map((resource, index) => (
                <button
                  key={index}
                  onClick={() => handleResourceClick(resource)}
                  className="block p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition-colors border border-gray-600 hover:border-blue-500 w-full"
                >
                  <span className="text-blue-400 font-medium">{resource.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full mt-8 py-6 px-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center space-x-6">
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}