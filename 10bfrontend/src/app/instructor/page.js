import Image from "next/image";
import Link from "next/link"
export default function Instructor() {
  // const [expandStudent, setExpandStudent] = useState(null);
  // const [expandModule, setExpandModule] = useState(null);
  return (
    <div className="container mx-auto min h-screen font-sans m-4 flex flex-col justify-center items-center">
      <nav className = "bg-black">
        <div className = "flex flex-wrap justify-between items-center p-4">
          <div className="flex space-x-4">
            <a href = "#" className = "text-white hover:text-lg transition-all">Profile</a>
            <a href = "/" className = "text-white hover:text-lg transition-all">Home</a>
            <a href = "#" className = "text-white hover:text-lg transition-all">Logout</a>
          </div>
        </div>
      </nav>
      <div className = "grid grid-cols-5 gap-6 my-8 mb-auto w-full">
        <div className = "bg-gray-800 rounded-lg p-4 w-full">
              <h2 className = "text-xl font-bold mb-4">Roster</h2>
              <div className = "space-y-5">
                <div className = "border border-gray-800 rounded-lg overflow-hidden">
                  <div className = "bg-amber-800 p-3 rounded cursor-pointer hover:bg-amber-600">
                      <div className = "font-medium">Suryateja Duvvuri</div>
                      <div className = "text-sm text-gray-300">NetId: sduvv003</div>
                      <div className = "text-xs">Progress: 75%</div>
                  </div> 
                </div>
                <div className = "border border-gray-800 rounded-lg overflow-hidden">
                  <div className = "bg-amber-800 p-3 rounded cursor-pointer hover:bg-amber-600">
                      <div className = "font-medium">Suryateja Duvvuri</div>
                      <div className = "text-sm text-gray-300">NetId: sduvv003</div>
                      <div className = "text-xs">Progress: 75%</div>
                  </div> 
                </div>
                <div className = "border border-gray-800 rounded-lg overflow-hidden">
                  <div className = "bg-amber-800 p-3 rounded cursor-pointer hover:bg-amber-600">
                      <div className = "font-medium">Suryateja Duvvuri</div>
                      <div className = "text-sm text-gray-300">NetId: sduvv003</div>
                      <div className = "text-xs">Progress: 75%</div>
                  </div> 
                </div>
                <div className = "border border-gray-800 rounded-lg overflow-hidden">
                  <div className = "bg-amber-800 p-3 rounded cursor-pointer hover:bg-amber-600">
                      <div className = "font-medium">Suryateja Duvvuri</div>
                      <div className = "text-sm text-gray-300">NetId: sduvv003</div>
                      <div className = "text-xs">Progress: 75%</div>
                  </div> 
                </div>
                <div className = "border border-gray-800 rounded-lg overflow-hidden">
                  <div className = "bg-amber-800 p-3 rounded cursor-pointer hover:bg-amber-600">
                      <div className = "font-medium">Suryateja Duvvuri</div>
                      <div className = "text-sm text-gray-300">NetId: sduvv003</div>
                      <div className = "text-xs">Progress: 75%</div>
                  </div> 
                </div>
                <div className = "border border-gray-800 rounded-lg overflow-hidden">
                  <div className = "bg-amber-800 p-3 rounded cursor-pointer hover:bg-amber-600">
                      <div className = "font-medium">Suryateja Duvvuri</div>
                      <div className = "text-sm text-gray-300">NetId: sduvv003</div>
                      <div className = "text-xs">Progress: 75%</div>
                  </div> 
                </div>
              </div>
              
          </div>
        <div className = "bg-gray-800 rounded-lg p-4 mb-6">
              <div className = "flex justify-between items-start">
                  <div>
                      <h2 className = "text-xl font-bold">Suryateja Duvvuri</h2>
                      <p className = "text-gray-300">NetID: sduvv003</p>
                  </div>
              </div>

              <div className = "grid grid-cols-1 gap-6 mt-6">
                  <div>
                      <h3 className = "text-lg mb-3">Progress</h3>
                      <div className = "w-full bg-gray-700 rounded-full h-5">
                          <div className = "bg-green-500 h-5 rounded-full" style={{width:"75%"}}></div>
                      </div>
                      <div className = "flex justify-between items-center text-sm mt-1">
                          <span>75%</span>
                          <span>20/40 problems</span>
                      </div>
                  </div>
                  <div>
                      <h3 className = "text-lg mb-3">
                          Top 5 Topics
                      </h3>

                      <div className = "space-y-6">
                        <div>
                          <div className = "flex justify-between mb-1">
                            <span className = "text-green-300">Linked Lists</span>
                            <span>80%</span>
                          </div>
                           <div className = "w-full bg-gray-700 rounded-full h-2 mb-4">
                              <div className = "bg-green-300 text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full" style={{width:"90%"}}></div>
                            </div>
                        </div>
                        <div>
                          <div className = "flex justify-between mb-1">
                            <span className = "text-red-300">Arrays</span>
                            <span>50%</span>
                          </div>
                           <div className = "w-full bg-gray-700 rounded-full h-2 mb-4">
                              <div className = "bg-red-300 text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full" style={{width:"50%"}}></div>
                            </div>
                        </div>
                        <div>
                          <div className = "flex justify-between mb-1">
                            <span className = "text-blue-300">Recursion</span>
                            <span>40%</span>
                          </div>
                           <div className = "w-full bg-gray-700 rounded-full h-2 mb-4">
                              <div className = "bg-blue-300 text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full" style={{width:"40%"}}></div>
                            </div>
                        </div>
                        <div>
                          <div className = "flex justify-between mb-1">
                            <span className = "text-yellow-300">Strings</span>
                            <span>30%</span>
                          </div>
                           <div className = "w-full bg-gray-700 rounded-full h-2 mb-4">
                              <div className = "bg-yellow-300 text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full" style={{width:"30%"}}></div>
                            </div>
                        </div>
                        <div>
                          <div className = "flex justify-between mb-1">
                            <span className = "text-emerald-500">Stacks and Queues</span>
                            <span>20%</span>
                          </div>
                           <div className = "w-full bg-gray-700 rounded-full h-2 mb-4">
                              <div className = "bg-emerald-500 text-sm font-medium text-white p-1 text-center leading-none h-2 rounded-full" style={{width:"20%"}}></div>
                            </div>
                        </div>
                      </div>
                  </div>
                  <button className = "bg-blue-400 text-white px-4 py-1 rounded">
                      Assign Problems
                  </button>
                  <button className = "bg-blue-400 text-white px-4 py-1 rounded">
                      Generate Passcode
                  </button>
                  <button className = "bg-red-400 text-white px-4 py-1 rounded">
                      Remove
                  </button>
              </div>
          </div>
          <div>
            <h3 className = "text-lg">Problems</h3>
            <div className = "space-y-2">
              <div className = "border border-gray-700 rounded">
                <div className = "flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                  <div className = "font-medium">Warm up 1</div>
                </div>
              </div>
              <div className = "border border-gray-700 rounded">
                <div className = "flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                  <div className = "font-medium">Warm up 2</div>
                </div>
              </div>
              <div className = "border border-gray-700 rounded">
                <div className = "flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                  <div className = "font-medium">File Streams 1</div>
                </div>
              </div>
              <div className = "border border-gray-700 rounded">
                <div className = "flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                  <div className = "font-medium">Classes 1</div>
                </div>
              </div>
              <div className = "border border-gray-700 rounded">
                <div className = "flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                  <div className = "font-medium">Classes 2</div>
                </div>
              </div>
              <div className = "border border-gray-700 rounded">
                <div className = "flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                  <div className = "font-medium">Inheritance and Polymorphism</div>
                </div>
              </div>
              <div className = "border border-gray-700 rounded">
                <div className = "flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                  <div className = "font-medium">Search and Sorting</div>
                </div>
              </div>
              <div className = "border border-gray-700 rounded">
                <div className = "flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                  <div className = "font-medium">Stack and Queues</div>
                </div>
              </div>
              <div className = "border border-gray-700 rounded">
                <div className = "flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                  <div className = "font-medium">Linked List 1</div>
                </div>
              </div>
              <div className = "border border-gray-700 rounded">
                <div className = "flex justify-between items-center bg-emerald-700 p-3 cursor-pointer hover:bg-emerald-600">
                  <div className = "font-medium">Linked List 2</div>
                </div>
              </div>
            </div>
          </div>
          <div className = "bg-gray-900 p-3">
            <div className = "space-y-2">
              <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                <span className = "cursor-pointer">Easy</span>
                {/* <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button> */}
              </div>
              <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                <span className = "cursor-pointer">Medium</span>
                {/* <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button> */}
              </div>
              <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                <span className = "cursor-pointer">Hard</span>
                {/* <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button> */}
              </div>
            </div>
          </div>
          <div className = "border border-gray-700 rounded">
            <div className = "bg-gray-800 p-3 cursor-pointer">
              <div className = "space-y-2">
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 1</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 2</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 3</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 4</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 5</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 6</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 7</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 8</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 9</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 10</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 11</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 12</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 13</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 14</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>
                <div className = "flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>Easy 15</span>
                  <button className = "text-xs bg-gray-600 px-2 py-1 cursor-pointer rounded">See Graph</button>
                </div>

              </div>
              

            </div>
          </div>
      </div>
      <button className = "w-1/4 bg-cyan-400 text-white py-2 rounded mt-4">
            + Add Student
        </button>


      
       <footer className = "w-full mt-8 mb-4 px-4 rounded-lg shadow-sm">
        <div className = "flex justify-center space-x-4">
          <a href = "#" className = "text-gray-300">Home</a>
          <a href = "#" className = "text-gray-300">Contact</a>
          
        </div>
     </footer>
      
    </div>

  );
}
