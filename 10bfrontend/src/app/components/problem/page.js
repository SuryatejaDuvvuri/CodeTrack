import Image from "next/image";
import Link from "next/link"
import CodeEditor from './codeEditor.js'
import ProgressGraph from "./progressGraph.js";
import ChatHistory from "./chatHistory.js";
export default function Problem() {
  return (
    <div className="container mx-auto flex flex-col min h-screen font-sans">
      <header className = "w-full py-8 px-4">
        <div className = "flex justify-between items-center mb-4">
          <div className = "space-x-2">
            <button className = "px-3 py-1 bg-gray-700 rounded">Prev</button>
            <button className = "px-3 py-1 bg-gray-700 rounded">Next</button>
            <button className = "px-3 py-1 bg-gray-700 rounded">Random</button>
          </div>
         <span className="px-2 py-1 rounded text-xs">
          Difficulty: 3 out of 4
         </span>
        </div>
        <span className="text-2xl font-bold mb-2">
          Warm Up
        </span>
        <p className="mb-2">
          The parameter weekdays true if it is a weekday, 
          and the parameter vacation is true if we are on vacation. 
          We sleep in if it is not a weekday or we're on vacation. 
          Return true if we sleep in.
        </p>
      </header>

      <div className = "flex flex-1 w-full md:flex-row flex-grow gap-6 px-4">
        <div className = "flex-1 bg-gray-700 rounded-lg p-4 flex flex-col">
          <div className = "flex-1 mb-4">
            VS Code Editor
            <CodeEditor/>
          </div>
          
        </div>
        <div className = "flex flex-1 bg-gray-700 rounded-lg p-4 flex-col">
          <div className = "flex-1 mb-4">
            <div className = "p-3 rounded mb-3">
              <div className = "overflow-auto">
                <table className = "w-full text-sm">
                  <thead>
                    <tr className = "border-b border-gray-600">
                      <th className = "text-left py-2 px-3">Test Case</th>
                      <th className = "text-left py-2 px-3">Expected</th>
                      <th className = "text-left py-2 px-3">Your Output</th>
                      <th className = "text-left py-2 px-3">Matches?</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className = "border-b border-gray-600">
                      <td className = "py-2 px-3">Case 1</td>
                      <td className = "py-2 px-3 font-mono">50</td>
                      <td className = "py-2 px-3 font-mono">25</td>
                      <td className = "py-2 px-3 text-red-400">False</td>
                    </tr>
                    <tr className = "border-b border-gray-600">
                      <td className = "py-2 px-3">Case 2</td>
                      <td className = "py-2 px-3 font-mono">15</td>
                      <td className = "py-2 px-3 font-mono">15</td>
                      <td className = "py-2 px-3 text-green-400">True</td>
                    </tr>
                    <tr className = "border-b border-gray-600">
                      <td className = "py-2 px-3">Case 3</td>
                      <td className = "py-2 px-3 font-mono">22</td>
                      <td className = "py-2 px-3 font-mono">25</td>
                      <td className = "py-2 px-3 text-red-400">False</td>
                    </tr>
                     <tr className = "border-b border-gray-600">
                      <td className = "py-2 px-3">Case 4</td>
                      <td className = "py-2 px-3 font-mono">50</td>
                      <td className = "py-2 px-3 font-mono">25</td>
                      <td className = "py-2 px-3 text-red-400">False</td>
                    </tr>
                    <tr className = "border-b border-gray-600">
                      <td className = "py-2 px-3">Case 5</td>
                      <td className = "py-2 px-3 font-mono">15</td>
                      <td className = "py-2 px-3 font-mono">15</td>
                      <td className = "py-2 px-3 text-green-400">True</td>
                    </tr>
                    <tr className = "border-b border-gray-600">
                      <td className = "py-2 px-3">Case 6</td>
                      <td className = "py-2 px-3 font-mono">22</td>
                      <td className = "py-2 px-3 font-mono">25</td>
                      <td className = "py-2 px-3 text-red-400">False</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className = "p-2 rounded mt-18">
              <h4 className =  "text-md font-semibold pt-8">Chat History</h4>
              <ChatHistory/>
            </div>
          </div>
          
        </div>
      </div>

      <div>
        <ProgressGraph/>
      </div>

      <div className = "m-auto px-4">
        <h3 className = "text-lg font-semibold mb-2">Resources</h3>

        <div className = "flex flex-wrap gap-3">
          <a href = "#">C++ Reference</a>
          <a href = "#">Zybooks</a>
          <a href = "#">LearnCpp.com</a>
          <a href = "#">Stack Overflow</a>
        </div>
      </div>

     

     <footer className = "w-full mt-8 mb-4 px-4">
        <div className = " flex justify-center space-x-4">
          <a href = "#" className = "text-gray-300">Home</a>
          <a href = "#" className = "text-gray-300">Contact</a>
          
        </div>
     </footer>
        
    </div>
  );
}
