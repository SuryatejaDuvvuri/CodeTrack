"use client";
import Image from "next/image";
import Link from "next/link"
import {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";


function filterDifficulties(topic)
{
  if(topic != null && (topic === "Warm up 1" || topic === "Warm up 2"))
  {
    return ["Easy"];
  }
  else
  {
      return ["Easy","Medium","Hard"];
  }
}

export default function Instructor() {
  const router = useRouter();
  const [roster, setRoster] = useState([]);
  const [role, setRole] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [modal,setModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNetId, setNewNetId] = useState("");
  const [adding, setAdding] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [problemName, setProblemName] = useState("");
  const [description, setDescription] = useState("");
  const [examples, setExamples] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [creating, setCreating] = useState(false);
  const [netid, setNetid] = useState('');
  const [msg, setMsg] = useState('');
  const [problemsList, setProblemsList] = useState([]);
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

  useEffect(() => {
    const r = localStorage.getItem('role');
    setRole(r);
    if(r === "STUDENT")
    {
      router.push('/');
    }
  }, []);
  
  const createProblem = async (e) => {
    e.preventDefault();
    setCreating(true);
    await fetch("http://localhost:8080/api/instructor/create", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        name: problemName,
        description,
        examples,
        starterCode,
      }),
    });
    setCreating(false);
    setCreateModal(false);
    setProblemName("");
    setDescription("");
    setExamples("");
    setStarterCode("");
    setSelectedTopic("");
    setSelectedDifficulty("");
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setAdding(true);
    await fetch("http://localhost:8080/api/instructor/addStudent", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name: newName, netId: newNetId}),
    });
    setAdding(false);
    setModal(false);
    setNewName("")
    setNewNetId("");
    setSelectedStudent(null);
    setStudentDetails(null);

    const res = await fetch("http://localhost:8080/api/instructor/roster")
    if(res.ok)
    {
      const data = await res.json();
      setRoster(data);
    }
  };

  const problems = [];  
  for (let i = 1; i <= 5; i++) 
  {
      problems.push(`${selectedDifficulty} ${i}`);
  }

  const handleDifficultySelect = (difficulty) => {
    const probs = problems.filter(p=>p.startsWith(difficulty));
    const allSelected = probs.every(p=>selectedProblems.includes(p));

    if(allSelected)
    {
      setSelectedProblems(selectedProblems.filter(p => !probs.includes(p)));
    }
    else
    {
      setSelectedProblems([...new Set([...selectedProblems,...probs])]);
    }
  };

  const handleSelect = (problem) => {
    setSelectedProblems(selectedProblems.includes(problem) ? selectedProblems.filter(p => p !== problem) : [...selectedProblems,problem]);
  };

  useEffect(() => {
    const fetchRoster = async () => {
      const res = await fetch("http://localhost:8080/api/instructor/roster");
      if (res.ok) {
        const data = await res.json();
        setRoster(data);
      }
    };
    fetchRoster();
  }, []);

  useEffect(() => {
    if(selectedStudent)
    {
      const fetchStudent = async () => {
        const res = await fetch (`http://localhost:8080/api/instructor/studentDetails?netId=${selectedStudent.netId}`);
        if(res.ok)
        {
          const data = await res.json();
          setStudentDetails(data);
        }
      };
      fetchStudent();
    }

  },[selectedStudent]);

  useEffect(() => {
    setSelectedProblems([]);
  }, [selectedTopic, selectedDifficulty]);

  const handleSelectProblem = (problemId) => {
  setSelectedProblems((p) =>
    p.includes(problemId) ? p.filter((pr) => pr !== problemId) : [...p, problemId]
  );
};


  const handleRemoveStudent = async () => {
    if (!selectedStudent){return;}
    if(!window.confirm(`Remove Student ${selectedStudent.name}?`)) return;
    await fetch("http://localhost:8080/api/instructor/removeStudent", {
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({netId: selectedStudent.netId}),
    });
    setSelectedStudent(null);
    setStudentDetails(null);

    const res = await fetch("http://localhost:8080/api/instructor/roster")
    if(res.ok)
    {
      const data = await res.json();
      setRoster(data);
    }
  }

  const assignedProblems = selectedProblems.map(p => ({
    problem: p,
    completed: false,
    dueDate:dueDate
  }));

  const handleAssignProblems = async () => {
    if (!selectedStudent || selectedProblems.length === 0 || !dueDate)
    {
      alert("Please select a student, at least one problem, and a due date.");
      return
    }
     await fetch("http://localhost:8080/api/instructor/assignProblems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          netId: selectedStudent.netId,
          problems: assignedProblems,
        }),
      });
    alert(`Problems assigned to ${selectedStudent.name}!`);
  }

  useEffect(() => {
    if(!modal)
    {
      fetch("http://localhost:8080/api/instructor/roster").then(res => res.ok ? res.json() : []).then(data => setRoster(data));
    }
  },[modal]);

  const handleAssignAllProblems = async () => {
    if (selectedProblems.length === 0 || !dueDate)
    {
      alert("Please select at least one problem, and a due date.");
      return
    }

    await fetch("http://localhost:8080/api/instructor/assignProblemsAll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problems: assignedProblems,
        }),
      });
    alert("Problems assigned to all students!");

  }

  useEffect(() => {
    console.log(selectedTopic);
    console.log(selectedDifficulty);
    if (!selectedTopic || !selectedDifficulty) 
    {
      setProblemsList([]);
      return;
    }
    const fetchProblems = async () => {
        const res = await fetch(`http://localhost:8080/api/chat/problems?topic=${encodeURIComponent(selectedTopic.name)}&difficulty=${encodeURIComponent(selectedDifficulty)}`);
        if (res.ok) 
        {
            const data = await res.json();
            console.log(data);
            setProblemsList(data); 
        }
    };
    fetchProblems();
}, [selectedDifficulty]);

  return (
     <div className="min-h-screen w-full font-sans flex flex-col bg-gradient-to-r from-gray-700 via-gray-900 to-gray-800">
      {role === 'INSTRUCTOR' ? (
        <>
          <nav className="shadow-lg">
            <div className="flex flex-wrap justify-between items-center p-4">
              <div className="flex space-x-4">
                <a href="/" className="text-blue-300 hover:text-white text-lg font-semibold transition-all transform hover:scale-110">
                  Home
                </a>
                <a onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  window.location.href = '/components/login';
                }} className="text-blue-300 hover:text-white text-lg font-semibold transition-all cursor-pointer transform hover:scale-110">
                  Logout
                </a>
              </div>
            </div>
          </nav>
          <div className={`grid ${selectedStudent ? "grid-cols-5" : "grid-cols-1"} gap-6 my-8 mb-auto w-full`}>
            <div className="bg-gray-800 rounded-lg p-4 w-full border border-gray-700 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-blue-300">Roster</h2>
              <div className="space-y-5">
                {roster.map((student) => (
                  <div key={student.netId} className="border border-gray-700 rounded-lg overflow-hidden transition-all duration-300">
                    <div
                      className="bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-600 transform transition-all hover:scale-101"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="font-medium text-white">{student.name}</div>
                      <div className="text-sm text-blue-200">NetId: {student.netId}</div>
                      <div className="text-xs text-gray-300">Progress: {student.progress}%</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded mt-4 cursor-pointer transform transition-all hover:scale-100 hover:bg-blue-600 active:scale-95 focus:ring-2 focus:ring-amber-400" onClick={() => setCreateModal(true)}>
                + Create Problem
              </button>
              {modal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <form className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4 min-w-[300px] border border-gray-700" onSubmit={handleAddStudent}>
                    <h2 className="text-xl font-bold text-blue-300 mb-2">Add Student</h2>
                    <input className="rounded px-2 py-1 bg-gray-700 text-white border border-gray-600" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} required />
                    <input className="rounded px-2 py-1 bg-gray-700 text-white border border-gray-600" placeholder="NetID" value={newNetId} onChange={e => setNewNetId(e.target.value)} required />
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded transform transition-all hover:scale-105 hover:bg-blue-600 active:scale-95 focus:ring-2 focus:ring-blue-400" disabled={adding}>{adding ? "Adding..." : "Add"}</button>
                      <button type="button" className="bg-gray-600 text-white px-4 py-1 rounded transform transition-all hover:scale-105 hover:bg-gray-800 active:scale-95 focus:ring-2 focus:ring-gray-400" onClick={() => setModal(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}
              {createModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <form className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4 min-w-[350px] border border-gray-700" onSubmit={createProblem}>
                    <h2 className="text-xl font-bold text-blue-300 mb-2">Create Problem</h2>
                    <div>
                      <label className="block text-gray-200 mb-1">Topic: </label>
                      <div className="flex flex-wrap gap-2">
                        {topics.map(topic => (
                          <button type="button" key={topic.name} className={`px-3 py-1 rounded font-semibold ${selectedTopic === topic.name ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"} transform transition-all hover:scale-105`} onClick={() => setSelectedTopic(topic.name)}>
                            {topic.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-200 mb-1">Difficulty:</label>
                      <div className="flex gap-2">
                        {filterDifficulties(selectedTopic).map(diff => (
                          <button type="button" key={diff} className={`px-3 py-1 rounded font-semibold ${selectedDifficulty === diff ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"} transform transition-all hover:scale-105`} onClick={() => setSelectedDifficulty(diff)}>
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input className="rounded px-2 py-1 bg-gray-700 text-white border border-gray-600" placeholder="Problem Name" value={problemName} onChange={e => setProblemName(e.target.value)} required />
                    <textarea className="rounded px-2 py-1 bg-gray-700 text-white border border-gray-600" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
                    <textarea className="rounded px-2 py-1 bg-gray-700 text-white border border-gray-600" placeholder="Examples" value={examples} onChange={e => setExamples(e.target.value)} required />
                    <textarea className="rounded px-2 py-1 bg-gray-700 text-white border border-gray-600" placeholder="Starter Code" value={starterCode} onChange={e => setStarterCode(e.target.value)} required />
                    <input type="file" accept=".txt,.cpp,.py,.java,.js" className="mt-2 text-white" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const text = await file.text();
                        setStarterCode(text);
                      }
                    }} />
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded transform transition-all hover:scale-105 hover:bg-blue-600 active:scale-95 focus:ring-2 focus:ring-blue-400" disabled={creating}>
                        {creating ? "Creating..." : "Create"}
                      </button>
                      <button type="button" className="bg-gray-600 text-white px-4 py-1 rounded transform transition-all hover:scale-105 hover:bg-gray-800 active:scale-95 focus:ring-2 focus:ring-gray-400" onClick={() => setCreateModal(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            {selectedStudent && studentDetails && (
              <>
                <div className="bg-gray-800 rounded-lg p-4 mb-6 animate-fade-in transition-all duration-500 col-span-4 border border-gray-700 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-blue-300">{studentDetails.name}</h2>
                      <p className="text-blue-200">NetID: {studentDetails.netId}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <div>
                      <h3 className="text-lg mb-3 text-blue-400 font-semibold">Progress</h3>
                      <div className="w-full bg-gray-700 rounded-full h-5">
                        <div className="bg-green-500 h-5 rounded-full" style={{ width: `${studentDetails.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1 text-gray-300">
                        <span>{studentDetails.progress}%</span>
                        {studentDetails.totalProblems > 0 && (
                          <span>{studentDetails.completedProblems}/{studentDetails.totalProblems} problems</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg mb-3 text-blue-400 font-semibold">Top 5 Topics</h3>
                      <div className="space-y-6">
                        {studentDetails.topTopics.map((topic,index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className={topic.textColor}>{topic.name}</span>
                              <span>{topic.percent}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                              <div className={`${topic.barColor} text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full`} style={{width: `${topic.percent}%`}}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <label className="block text-gray-200 mb-1">Due Date:</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="rounded px-2 py-1 bg-gray-700 text-white border border-gray-600"
                    />
                    <button className="bg-blue-400 text-white px-4 py-1 rounded cursor-pointer transform transition-all hover:scale-105 hover:bg-blue-500 active:scale-95 focus:ring-2 focus:ring-blue-400" onClick={handleAssignProblems}>Assign Problems</button>
                    <button className="bg-blue-400 text-white px-4 py-1 rounded cursor-pointer transform transition-all hover:scale-105 hover:bg-blue-500 active:scale-95 focus:ring-2 focus:ring-blue-400" onClick={handleAssignAllProblems}>Assign All</button>
                    <button className="bg-red-400 text-white px-4 py-1 rounded cursor-pointer transform transition-all hover:scale-105 hover:bg-red-500 active:scale-95 focus:ring-2 focus:ring-red-400" onClick={handleRemoveStudent}>Remove</button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 text-blue-300">Problems</h3>
                  <div className="space-y-3">
                    {topics.map((problem,index) => (
                      <button key={index} className={`w-full text-left px-5 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 transform hover:scale-105 ${selectedTopic === problem ? "bg-emerald-900" : "bg-emerald-700"} hover:bg-emerald-600 text-white`} onClick={() => setSelectedTopic(problem)}>
                        {problem.name}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedTopic && (
                  <>
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 mt-4">
                      <div className="space-y-2">
                        {filterDifficulties(selectedTopic).map((diff) => (
                          <div
                            key={diff}
                            className={`flex justify-between items-center bg-gray-800 p-2 rounded mb-2 cursor-pointer ${selectedDifficulty === diff ? "bg-gray-600" : ""} transform transition-all hover:scale-105`}
                            onClick={() => setSelectedDifficulty(diff)}
                          >
                            <span className="ml-2 text-white">{diff}</span>
                            <input
                              type="checkbox"
                              checked={selectedDifficulty === diff && problemsList.length > 0 && problemsList.slice(0, 5).every(p => selectedProblems.includes(p.id))}
                              onChange={(e) => {
                                e.stopPropagation();
                                if (selectedDifficulty === diff && problemsList.length > 0) {
                                  const ids = problemsList.slice(0, 5).map(p => p.id);
                                  const allSelected = ids.every(id => selectedProblems.includes(id));
                                  if (allSelected) {
                                    setSelectedProblems(selectedProblems.filter(p => !ids.includes(p)));
                                  } else {
                                    setSelectedProblems([...selectedProblems, ...ids.filter(id => !selectedProblems.includes(id))]);
                                  }
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedDifficulty && (
                      <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 mt-4">
                        <div className="space-y-2">
                         {problemsList.slice(0,5).map((problem,index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                             <input
                              type="checkbox"
                              checked={selectedProblems.includes(problem.id)}
                              onChange={() => handleSelectProblem(problem.id)}
                            />
                              <span className="text-white">{problem.Name}</span>
                              <button
                                className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded transform transition-all hover:scale-110 hover:bg-blue-700 active:scale-95 focus:ring-2 focus:ring-blue-400"
                                onClick={() => {
                                  router.push(
                                    `/components/problem?netId=${selectedStudent.netId}&topic=${encodeURIComponent(selectedTopic.name)}&difficulty=${encodeURIComponent(selectedDifficulty)}&problem=${encodeURIComponent(problem.Problem)}&viewingStudent=${selectedStudent.netId}`
                                  );
                                }}
                              >
                                See Graph
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </>
      ) : role === 'STUDENT' ? (
        <div>
          You're not supposed to be here. Please go back and login correctly. 
        </div>
      ) : (
        <div>
          <h2>Welcome! Please go back and log in.</h2>
        </div>
      )}
      <footer className="w-full mt-8 mb-4 px-4 rounded-lg shadow-lg bg-gray-900 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 py-4">
          <a href="#" className="text-blue-300 hover:text-white cursor-pointer font-semibold transition-all transform hover:scale-110">Home</a>
          <span className="text-gray-500">|</span>
          <a href="#" className="text-blue-300 hover:text-white cursor-pointer font-semibold transition-all transform hover:scale-110">Contact</a>
        </div>
        <div className="text-center text-gray-500 text-xs pb-2">&copy; 2025 CS010B Practice Portal</div>
      </footer>
    </div>
  );
}
