'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link"
import CodeEditor from './codeEditor.js'
import ProgressGraph from "./progressGraph.js";
import ChatHistory from "./chatHistory.js";
import { useSearchParams,useRouter } from "next/navigation";
// import EmbeddedViewer from "./EmbeddedViewer.js";

export default function Problem() 
{
  const router = useRouter();
  const search = useSearchParams();
  const topic = search.get("topic");
  const netid = typeof window !== "undefined" ? localStorage.getItem('netid') : null;
  const difficulty = search.get("difficulty");
  const problemName = search.get("problem");
  const maxProblems = 5;
  const match = problemName?.match(/(\d+)$/);
  const problemNum = match ? parseInt(match[1],10) : 1;
  const [defaultCode, setDefaultCode] = useState("");
  const [isLoading, setLoading] = useState(false);
  const[aiAttempts,setAIAttempts] = useState(0);
  const [code, setCode] = useState(""); 
  const [problemDetails, setProblemDetails] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const viewingStudent = search.get("viewingStudent");
  const readOnly = role === "INSTRUCTOR" && viewingStudent;
  const MAX_ATTEMPTS = 4;

  useEffect(() => {
    if ( role === "STUDENT" && viewingStudent && viewingStudent !== netid) 
    {
      router.replace("/components/login");
    }
  }, [role, viewingStudent, netid, router]);

  const start = async () => {
    if(role === "INSTRUCTOR" && viewingStudent)
    {
        const res = await fetch(`http://localhost:8080/api/grade/code?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(problemName)}&netId=${viewingStudent}`);
        if (res.ok) {
          const data = await res.text();
          setCode(data);
          setDefaultCode(data);
          return;
        }
    }
    else
    {
      const res = await fetch (`http://localhost:8080/api/chat/load?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(problemName)}`)
      const wait = await res.text();
      setCode(wait);
      setDefaultCode(wait);
    }
  };

  const loadProblem = async () => {
    const res = await fetch (`http://localhost:8080/api/chat/loadProblem?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(problemName)}`)
    if(res.ok)
    {
      const data = await res.json();
      setProblemDetails(data);
    }
  };

  const handlePrev = () => {
    const prevNum = problemNum === 1 ? maxProblems : problemNum - 1;
    const newProblem = `${difficulty} ${prevNum}`;
    router.push(`/components/problem?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(newProblem)}`);
  }

  const handleNext = () => {
    const prevNum = problemNum === maxProblems ? 1 : problemNum + 1;
    const newProblem = `${difficulty} ${prevNum}`;
    router.push(`/components/problem?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(newProblem)}`);
  }

  useEffect(() => {
    loadProblem();
  },[topic,difficulty,problemName]);
  
  useEffect(() => {
    start();
  }, [topic, difficulty, problemName]);

  const loadCode = async () => 
  {
    const res = await fetch(`http://localhost:8080/api/grade/code?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(problemName)}&netId=${netid}`, {
      method: "GET",
      headers: {
        "Content-Type":"application/json"
      }
    });
    
    if(res.ok)
    {
      const data = await res.text();
      if(data.length > 1)
      {
        setCode(data);
      }
     
    }
  };

  const saveCode = async () =>
  {
      const chatRes = await fetch ("http://localhost:8080/api/grade/update", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({topic,difficulty,problem:problemName,code:code,netId: netid}),
    });
  }
  const fetchAttempts = async () => 
  {
    const res = await fetch(`http://localhost:8080/api/progress/lastTime?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(problemName)}&netId=${netid}`);
    const resTwo = await fetch(`http://localhost:8080/api/progress/attempts?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(problemName)}&netId=${netid}`);

    if(res.ok && resTwo.ok)
    {
      const data = await res.json();
      const dataTwo = await resTwo.json(); 
      const lastAIAttempt = data;
      const now = Date.now();
      const hoursPassed = (now - lastAIAttempt) / (1000 * 60 * 60);

      if(hoursPassed >= 5)
      {
        setAIAttempts(0);
        await fetch("http://localhost:8080/api/progress/update", {
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify({
            topic,
            difficulty,
            problem:problemName,
            aiAttempts: 0,
            netId: netid
          })
        });
      }
      else
      {
        console.log("AI attempts from backend:", dataTwo);
        setAIAttempts(dataTwo);
      }
    }
  }

  const fetchScore = async () => 
  {
    const res = await fetch(`http://localhost:8080/api/progress/latestScore?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(problemName)}&netId=${netid}`);
    if (res.ok) 
    {
      const data = await res.json();
      setLatestScore(data);
    }
  };

  const refreshAll = async () => 
  {
    await fetchAttempts(),
    await fetchProgress(),
    await fetchScore(),
    await loadCode()
};

  const handleRun = async () =>
  {
    setLoading(true);
    setTimeout(fetchAttempts,100);
    const runStart = Date.now();
    const res = await fetch("http://localhost:8080/api/grade", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({topic,difficulty,problem:problemName,code: code, netId: netid}),
    });
    const result = await res.json();
    console.log(result);
    const runEnd = Date.now();
    const timeSpent = startTime ? Math.round((runEnd - runStart) / 1000) : 0;
    setStartTime(null); 
    if(result.status === "error")
    {
        setMessages(prev => [
          ...prev,
          {role: "system",content:result.details}
        ]);
        await refreshAll();
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
          topic,difficulty,problem:problemName,passed,total,timeSpent,testResults:result, code:code,netId:netid
        })
      });

      setTimeout(fetchScore, 100);

      await fetchProgress();
    }


    if(aiAttempts < MAX_ATTEMPTS)
    {
        const chatRes = await fetch ("http://localhost:8080/api/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              topic,
              difficulty,
              problem:problemName,
              prompt: "I'm learning programming. Please analyze my code and explain: 1) What I did well, 2) What concepts I might be misunderstanding, 3) Specific improvements with examples, 4) Learning resources for areas I'm struggling with. Keep explanations beginner-friendly.",
              netId: netid
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
            await refreshAll();
            setLoading(false);
        }
        await fetch("http://localhost:8080/api/progress/update", {
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify({topic,difficulty,problem:problemName,aiAttempts:aiAttempts+1,netId:netid})
        });
        setAIAttempts(aiAttempts + 1);
    }
    else if(aiAttempts === MAX_ATTEMPTS)
    {
        const passed = result.filter(r => r.result === "PASS").length;
        const total = result.length;
        const rate = (passed/total) * 100;

        if(rate >= 80 && aiAttempts <= MAX_ATTEMPTS)
        {
            const chatRes = await fetch ("http://localhost:8080/api/chat", {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({
                topic,
                difficulty,
                problem:problemName,
                prompt: "I'm learning programming. Please analyze my code and explain: 1) What I did well, 2) What concepts I might be misunderstanding, 3) Specific improvements with examples, 4) Learning resources for areas I'm struggling with. Keep explanations beginner-friendly.",
                netId: netid
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
              await refreshAll();
              setLoading(false);
          }
          await fetch("http://localhost:8080/api/progress/update", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({topic,difficulty,problem:problemName,aiAttempts:aiAttempts+1,netId: netid})
          });
          setAIAttempts(aiAttempts + 1);
       }
       else
       {
          setMessages(prev => [
            ...prev,
            {role: "system", content: "Pass at least 80% of test cases to unlock final feedback."}
          ]);
          await refreshAll();
          setLoading(false);
          setAIAttempts(aiAttempts + 1);
          return;
       }
    }
    else
    {
      setMessages(prev => [
        ...prev,
        {role: "system", content: "AI attempts exceeded. Your attempts will reset in 5 hours but do rely on test cases."}
      ]);
      await refreshAll();
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
  }, [problemName]);

  const [results, setResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [latestScore, setLatestScore] = useState(null);

   useEffect(() => {
    const chatCont = document.querySelector('.overflow-y-auto');
    if(chatCont)
    {
      chatCont.scrollTop = chatCont.scrollHeight;
    }
  },[messages,isLoading]);

  const fetchProgress = async () => {
    const progressRes = await fetch(`http://localhost:8080/api/progress?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&problem=${encodeURIComponent(problemName)}&netId=${netid}`);
    if(progressRes.ok)
    {
      const data = await progressRes.json();
      setProgressData(data.map(run => ({
        timestamp:new Date(run.timestamp),
        success:run.successRate >= 80,
        duration: run.timeSpent,
        successRate:run.successRate,
        code: run.code,
        testResults: run.testResults
      })))
      if (Array.isArray(data) && data.length > 0 && data[data.length - 1].testResults) 
      {
        setResults(data[data.length - 1].testResults);
      }
    }
  }


  useEffect(() => {
    fetchScore();
  }, [problemName]);

  useEffect(() => {
    fetchAttempts();
    fetchProgress();
  },[problemName]);

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
  var color = "bg-yellow-400";
  const diff = problemDetails?.Difficulty;
  if(diff <= 4)
  {
    color = "bg-amber-400";
  }
  else if(diff >= 7)
  {
    color = "bg-orange-600";
  }

  const latestAttemptIndex = progressData.length > 0 ? progressData.length - 1 : null;
  const currentAttemptIndex = selectedAttempt !== null ? selectedAttempt : latestAttemptIndex;
  const currentAttempt = progressData[currentAttemptIndex] || {};
  

  return (
    <div className="min-h-screen w-full font-sans flex flex-col bg-gradient-to-r from-gray-700 via-gray-900 to-gray-800">
      <nav className="w-full rounded-lg shadow-lg mb-8">
        <div className="flex flex-wrap justify-between items-center p-4">
          <div className="flex space-x-4">
            <Link href="/" className="text-blue-300 hover:text-white text-lg font-semibold transition-all transform hover:scale-110">Home</Link>
            <Link href="/components/login" className="text-blue-300 hover:text-white text-lg font-semibold transition-all cursor-pointer transform hover:scale-110">Logout</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4">
        <div className="max-w-7xl w-full">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-3">
                <button onClick={handlePrev} className="px-4 py-2 bg-gray-800 hover:bg-gray-600 rounded-lg text-center transition-colors cursor-pointer">Prev</button>
                <button onClick={handleNext} className="px-4 py-2 bg-gray-800 hover:bg-gray-600 rounded-lg text-center transition-colors cursor-pointer">Next</button>
              </div>
              <span className={`px-3 py-1 ${color} rounded-lg text-sm font-medium text-black`}>
                Difficulty: {diff || "0"} / 10
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-blue-400">{problemDetails?.Problem || "Loading..."}</h1>
            <p className="text-gray-300 text-lg mb-4 leading-relaxed">{problemDetails?.Description || " "}</p>
            <h2 className="text-xl font-bold mb-2 text-blue-400">Examples</h2>
            <div className="text-gray-200 text-base space-y-2">
              {problemDetails?.Examples
                ? problemDetails.Examples.split('\n').map((ex, i) => (
                    <div key={i} className="font-mono">{ex}</div>
                  ))
                : ""}
            </div>
          </header>
          <section className="bg-gray-800 rounded-xl border border-gray-700 w-full mx-auto mb-8">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-gray-200">Code Editor</h2>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <CodeEditor
                defaultCode={defaultCode}
                code={code}
                setCode={setCode}
                handleRun={handleRun}
                saveCode={saveCode}
                toggle={toggle}
                showGraph={showGraph}
                setStartTime={setStartTime}
                readOnly={readOnly}
              />
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Test Results</h2>
                <div className="mb-2">
                  <span className="text-gray-200 font-medium mr-2">Latest Score:</span>
                  <span className="text-xl font-bold text-blue-400">{latestScore !== null ? `${Math.round(latestScore)}%` : "0"}</span>
                </div>
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
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-200 mb-1">AI Assistant</h3>
              <ChatHistory
                topic={topic}
                difficulty={difficulty}
                problemName={problemName}
                messages={messages}
                setMessages={setMessages}
                isLoading={isLoading}
                aiAttempts={aiAttempts}
                setAIAttempts={setAIAttempts}
              />
            </div>
          </section>
          {showGraph && (
            <section className="bg-gray-800 rounded-xl border border-gray-700 p-11 mb-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Progress Overview</h3>
              <ProgressGraph
                attemptData={progressData}
                totalAttempts={totalAttempts}
                avgTime={avgTime}
                overallSuccess={overallSuccess}
                barClick={setSelectedAttempt}
              />
            </section>
          )}
          {showGraph && selectedAttempt !== null && currentAttempt && (
            <section className="bg-gray-900 rounded-xl p-6 mb-6 mt-4">
              <h3 className="text-lg font-semibold mb-4">
                Attempt {currentAttemptIndex + 1} Details
              </h3>
              <div className="mb-4">
                <h4 className="text-md font-bold text-gray-200 mb-2">Code</h4>
                <CodeEditor code={currentAttempt.code || code} readOnly={true} />
              </div>
              <div>
                <div className="overflow-x-auto">
                  <h4 className="text-md font-bold text-gray-200 mb-2">Test Results</h4>
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
                      {currentAttempt.testResults && currentAttempt.testResults.length > 0 ? (currentAttempt.testResults.map((test, index) => (
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
                            No test results for this attempt.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 rounded text-white bg-gray-600 cursor-pointer" onClick={() => setSelectedAttempt(null)}>
                Close
              </button>
            </section>
          )}
          <section className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Learning Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "Ascii Chart", url: "https://www.asciitable.com/" },
                { name: "Cheatsheet", url: "https://www.codewithharry.com/blogpost/cpp-cheatsheet" },
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
          </section>
        </div>
      </main>
      <footer className="w-full mt-8 mb-4 px-4 rounded-lg shadow-lg bg-gray-900 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 py-4">
          <Link href="#" className="text-blue-300 hover:text-white cursor-pointer font-semibold transition-all transform hover:scale-110">Home</Link>
          <span className="text-gray-500">|</span>
          <Link href="#" className="text-blue-300 hover:text-white cursor-pointer font-semibold transition-all transform hover:scale-110">Contact</Link>
        </div>
        <div className="text-center text-gray-500 text-xs pb-2">&copy; 2025 CodeTrack</div>
      </footer>
    </div>
  );
}