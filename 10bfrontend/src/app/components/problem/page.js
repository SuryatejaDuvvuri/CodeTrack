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
  const defaultCode = `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
i
}`;

    const defaultTestcases = `1 2|3
  5 7|12
  10 15|25
  3 4|7
  0 0|0`;

  const [testcases, setTestcases] = useState(defaultTestcases);
  const [code, setCode] = useState(defaultCode);
  const [results, setResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const handleRun = async () =>
  {
    setLoading(true);
    const res = await fetch("http://localhost:8080/api/grade", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({code: code,testcases: testcases}),
    });
    const result = await res.json();
    if(result.status === "error")
    {
        setMessages(prev => [
          ...prev,
          {role: "system",content:result.details}
        ]);
        setResults([]);
    }
    else
    {
      setResults(result);
    }
    setLoading(false);
  }

   useEffect(() => {
    const chatCont = document.querySelector('.overflow-y-auto');
    if(chatCont)
    {
      chatCont.scrollTop = chatCont.scrollHeight;
    }
  },[messages,isLoading]);

  const handleResourceClick = (resource) => 
  {
    const embedUrl = `/embeddedviewer?url=${encodeURIComponent(resource.url)}&title=${encodeURIComponent(resource.name)}`;
    window.open(embedUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const problem = "Easy 1"
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
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                Random
              </button>
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
                <CodeEditor code = {code} setCode = {setCode} handleRun = {handleRun} />
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
                        <th className="text-left py-3 px-4 font-medium text-gray-300">Expected</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-300">Your Output</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {results.length > 0 ? (results.map((test, index) => (
                        <tr key={index} className="hover:bg-gray-700/50">
                          <td className="py-3 px-4">Case {index + 1}</td>
                          <td className="py-3 px-4 font-mono text-blue-400">{test.expected}</td>
                          <td className="py-3 px-4 font-mono text-gray-300">{test.output}</td>
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

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-11 mb-6">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Progress Overview</h3>
            <ProgressGraph />
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Learning Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "C++ Reference", url: "https://www.w3schools.com/cpp/cpp_ref_reference.asp" },
                { name: "Zybooks", url: "https://learn.zybooks.com/zybook/UCRCS010BMillerSummer2025?selectedPanel=view-activity" },
                { name: "LearnCpp.com", url: "https://www.learncpp.com/" },
                { name: "JUnit Testing", url: "https://www.youtube.com/watch?v=vZm0lHciFsQ" }
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