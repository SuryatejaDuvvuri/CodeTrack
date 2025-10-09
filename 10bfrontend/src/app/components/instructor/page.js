"use client";
import Image from "next/image";
import Link from "next/link"
import {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";


function filterDifficulties(topic)
{
  console.log(topic);
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

  const handleSelectProblem = (problemName) => {
    setSelectedProblems((p) =>
      p.includes(problemName) ? p.filter((pr) => pr !== problemName) : [...p, problemName]
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

  return (
    <div className="container mx-auto min h-screen font-sans m-4 flex flex-col">
      
      {role === 'INSTRUCTOR' ? (
          <>
          <nav className="bg-black">
        <div className="flex flex-wrap justify-between items-center p-4">
          <div className="flex space-x-4">
            <a href="/" className="text-white hover:text-lg transition-all">
              Home
            </a>
            <a onClick = {() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              window.location.href = '/components/login';}} className="text-white hover:text-lg transition-all">
              Logout
            </a>
          </div>
        </div>
          </nav>
          <div className={`grid ${selectedStudent ? "grid-cols-5" : "grid-cols-1"} gap-6 my-8 mb-auto w-full`}>
            <div className="bg-gray-800 rounded-lg p-4 w-full">
              <h2 className="text-xl font-bold mb-4">Roster</h2>
              <div className="space-y-5">
                {roster.map((student) => (
                  <div key={student.netId} className={`border border-gray-800 rounded-lg overflow-hidden transition-all duration-300`}>
                    <div
                      className="bg-amber-800 p-3 rounded cursor-pointer hover:bg-amber-600"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-300">NetId: {student.netId}</div>
                      <div className="text-xs">Progress: {student.progress}%</div>
                    </div>
                  </div>
                ))}
              </div>
          {/* <button className="w-full  bg-amber-500 text-white py-2 rounded mt-4 cursor-pointer" onClick={() => setModal(true)}>+ Add Student</button> */}
          <button className="w-full bg-amber-500 text-white py-2 rounded mt-4 cursor-pointer" onClick={() => setCreateModal(true)}>
            + Create Problem
          </button>

          {modal && (
            <div className = "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <form className = "bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4 min-w-[300px]" onSubmit={handleAddStudent}>
                  <h2 className = "text-xl font-bold text-white mb-2">Add Student</h2>
                  <input className = "rounded px-2 py-1 bg-gray-700 text-white" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} required/>
                  <input className = "rounded px-2 py-1 bg-gray-700 text-white" placeholder="NetID" value={newNetId} onChange={e => setNewNetId(e.target.value)} required/>
                  <div className = "flex gap-2 mt-2">
                    <button type = "submit" className = "bg-blue-500 text-white px-4 py-1 rounded" disabled={adding}>{adding ? "Adding..." : "Add"}</button>
                    <button type = "button" className = "bg-gray-600 text-white px-4 py-1 rounded" onClick={() => setModal(false)}>Cancel</button>
                  </div>

              </form>
            
            </div>
          )}

          {createModal && (
            <div className = "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"> 
                <form className ="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4 min-w-[350px]" onSubmit={createProblem}>
                  <h2 className = "text-xl font-bold text-white mb-2">Create Problem</h2>
                  <div>
                    <label className = "block text-gray-200 mb-1">Topic: </label>
                    <div className = "flex flex-wrap gap-2">
                      {topics.map(topic => (
                        <button type = "button" key={topic.name} className = {`px-3 py-1 rounded ${selectedTopic === topic.name ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"}`} onClick={() => setSelectedTopic(topic.name)}>
                          {topic.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className = "block text-gray-200 mb-1">Difficulty:</label>
                    <div className = "flex gap-2">
                      {filterDifficulties(selectedTopic).map(diff => (
                        <button type = "button" key={diff} className ={`px-3 py-1 rounded ${selectedDifficulty === diff ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"}`} onClick={() => setSelectedDifficulty(diff)}>
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input className = "rounded px-2 py-1 bg-gray-700 text-white" placeholder="Problem Name" value={problemName} onChange={e => setProblemName(e.target.value)} required/>
                  <textarea
                    className="rounded px-2 py-1 bg-gray-700 text-white"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />

                  <textarea
                    className="rounded px-2 py-1 bg-gray-700 text-white"
                    placeholder="Examples"
                    value={examples}
                    onChange={e => setExamples(e.target.value)}
                    required
                  />
                  <textarea
                    className="rounded px-2 py-1 bg-gray-700 text-white"
                    placeholder="Starter Code"
                    value={starterCode}
                    onChange={e => setStarterCode(e.target.value)}
                    required
                  />
                  <input type = "file" accept=".txt,.cpp,.py,.java,.js" className = "mt-2 text-white" onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file)
                    {
                      const text = await file.text();
                      setStarterCode(text);
                    }
                  }}/>
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded" disabled={creating}>
                      {creating ? "Creating..." : "Create"}
                    </button>
                    <button type="button" className="bg-gray-600 text-white px-4 py-1 rounded" onClick={() => setCreateModal(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
            </div>
          )}
            </div>
            {selectedStudent && studentDetails && (
              <>
                <div className="bg-gray-800 rounded-lg p-4 mb-6 animate-fade-in transition-all duration-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">{studentDetails.name}</h2>
                      <p className="text-gray-300">NetID: {studentDetails.netId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <div>
                      <h3 className="text-lg mb-3">Progress</h3>
                      <div className="w-full bg-gray-700 rounded-full h-5">
                        <div className="bg-green-500 h-5 rounded-full" style={{ width: `${studentDetails.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span>{studentDetails.progress}%</span>
                        {studentDetails.totalProblems > 0 && (
                          <span>{studentDetails.completedProblems}/{studentDetails.totalProblems} problems</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg mb-3">Top 5 Topics</h3>

                      <div className="space-y-6 ">
                        {studentDetails.topTopics.map((topic,index) => (
                          <div key = {index}>
                            <div className = "flex justify-between mb-1">
                              <span className = {topic.textColor}>{topic.name}</span>
                              <span>{topic.percent}%</span>
                            </div>
                            <div className = "w-full bg-gray-700 rounded-full h-2 mb-4">
                              <div className = {`${topic.barColor} text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full`} style = {{width: `${topic.percent}%`}}>
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-green-300">Linked Lists</span>
                            <span>80%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                            <div
                              className="bg-green-300 text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full"
                              style={{ width: "90%" }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-red-300">Arrays</span>
                            <span>50%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                            <div
                              className="bg-red-300 text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full"
                              style={{ width: "50%" }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-blue-300">Recursion</span>
                            <span>40%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                            <div
                              className="bg-blue-300 text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full"
                              style={{ width: "40%" }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-yellow-300">Strings</span>
                            <span>30%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                            <div
                              className="bg-yellow-300 text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full"
                              style={{ width: "30%" }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-emerald-500">Stacks and Queues</span>
                            <span>20%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                            <div
                              className="bg-emerald-500 text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full"
                              style={{ width: "20%" }}
                            ></div>
                          </div>
                        </div> */}
                      </div>
                    </div>

                    <label className="block text-gray-200 mb-1">Due Date:</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="rounded px-2 py-1 bg-gray-700 text-white"
                    />
                    <button className="bg-blue-400 text-white px-4 py-1 rounded cursor-pointer" onClick={handleAssignProblems}>Assign Problems</button>
                    <button className="bg-blue-400 text-white px-4 py-1 rounded cursor-pointer" onClick={handleAssignAllProblems}>Assign All</button>
                    {/* <button className="bg-blue-400 text-white px-4 py-1 rounded cursor-pointer">Generate Passcode</button> */}
                    <button className="bg-red-400 text-white px-4 py-1 rounded cursor-pointer" onClick={handleRemoveStudent}>Remove</button>
                  </div>
                </div>
                <div className = "">
                  <h3 className="text-lg font-bold mb-4 text-white">Problems</h3>
                  <div className="space-y-3">
                    {topics.map((problem,index) => (
                      <button key = {index} className = {`w-full text-left px-5 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 ${selectedTopic === problem ? "bg-emerald-900" : "bg-emerald-700"} hover:bg-emerald-600`} onClick = {() => setSelectedTopic(problem)}>
                        {problem.name}
                        </button>
                    ))}
                    {/* <div className="border border-gray-700 rounded">
                      <div className="flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                        <div className="font-medium">Warm up 1</div>
                      </div>
                    </div>
                    <div className="border border-gray-700 rounded">
                      <div className="flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                        <div className="font-medium">Warm up 2</div>
                      </div>
                    </div>
                    <div className="border border-gray-700 rounded">
                      <div className="flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                        <div className="font-medium">File Streams 1</div>
                      </div>
                    </div>
                    <div className="border border-gray-700 rounded">
                      <div className="flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                        <div className="font-medium">Classes 1</div>
                      </div>
                    </div>
                    <div className="border border-gray-700 rounded">
                      <div className="flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                        <div className="font-medium">Classes 2</div>
                      </div>
                    </div>
                    <div className="border border-gray-700 rounded">
                      <div className="flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                        <div className="font-medium">Inheritance and Polymorphism</div>
                      </div>
                    </div>
                    <div className="border border-gray-700 rounded">
                      <div className="flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                        <div className="font-medium">Search and Sorting</div>
                      </div>
                    </div>
                    <div className="border border-gray-700 rounded">
                      <div className="flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                        <div className="font-medium">Stack and Queues</div>
                      </div>
                    </div>
                    <div className="border border-gray-700 rounded">
                      <div className="flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                        <div className="font-medium">Linked List 1</div>
                      </div>
                    </div>
                    <div className="border border-gray-700 rounded">
                      <div className="flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                        <div className="font-medium">Linked List 2</div>
                      </div>
                    </div> */}
                  </div>
                </div>
                {selectedTopic && (
                  <>
                  <div className="bg-gray-900 p-3">
                    <div className="space-y-2">
                      {filterDifficulties(selectedTopic).map((diff) => (
                        <div
                          key={diff}
                          className={`flex justify-between items-center bg-gray-800 p-2 rounded mb-2 cursor-pointer ${selectedDifficulty === diff ? "bg-gray-600" : ""}`} onClick={() => setSelectedDifficulty(diff)}>
                          <span className = "ml-2">{diff}</span>
                          <input type = "checkbox" checked={Array.from({length: 15}, (_, i) => `${diff} ${i+1}`).every(p => selectedProblems.includes(p))}
                          onChange={() => { setSelectedDifficulty(diff); handleDifficultySelect(diff);}} />
                        </div>
                      ))}
                      {/* <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                        <span className="cursor-pointer">Easy</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                        <span className="cursor-pointer">Medium</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                        <span className="cursor-pointer">Hard</span>
                      </div> */}
                    </div>
                  </div>
                  {selectedDifficulty && (
                    <>
                    <div className="">
                    <div className="bg-gray-800 p-3 cursor-pointer">
                      <div className="space-y-2">
                        {problems.map((problem,index) => (
                          <div key = {index} className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={selectedProblems.includes(problem)}
                              onChange={() => handleSelectProblem(problem)}
                            />
                            <span>{problem}</span>
                            <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded" onClick = {() =>{
                              router.push(
                                `/components/problem?netId=${selectedStudent.netId}&topic=${encodeURIComponent(selectedTopic.name)}&difficulty=${encodeURIComponent(selectedDifficulty)}&problem=${encodeURIComponent(problem)}&viewingStudent=${selectedStudent.netId}`
                              );
                            }}>See Graph</button>
                          </div>
                        ))}

                        {/* <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 1</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 2</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 3</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 4</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 5</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 6</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 7</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 8</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 9</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 10</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 11</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 12</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 13</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 14</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div>
                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                          <span>Easy 15</span>
                          <button className="text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                        </div> */}
                      </div>
                    </div>
                  </div>
                    </>
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
      ) : 
      <div>
        <h2>Welcome! Please go back and log in.</h2>
      </div>}
      
  

      <footer className="w-full mt-8 mb-4 px-4 rounded-lg shadow-sm">
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-gray-300 cursor-pointer">
            Home
          </a>
          <a href="#" className="text-gray-300 cursor-pointer">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
