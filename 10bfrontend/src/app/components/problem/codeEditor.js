"use client"
import {useEffect, useState} from 'react';
import Editor from '@monaco-editor/react'

export default function codeEditor()
{
    const [code,setCode] = useState(`#include <iostream> 
    using namespace std;

bool sleepIn(bool weekday, bool vacation) {
  // code here
  
}

int main() {
  cout << "Testing sleepIn function:" << endl;
  cout << "sleepIn(true, false): " << (sleepIn(true, false) ? "true" : "false") << endl;
  cout << "sleepIn(false, false): " << (sleepIn(false, false) ? "true" : "false") << endl;
  cout << "sleepIn(true, true): " << (sleepIn(true, true) ? "true" : "false") << endl;
  return 0;
}
    `)

    return (
        <div className = "flex-1 bg-gray-800 rounded-lg p-4 flex flex-col h-full">
            <div className = "flex-1 mb-4 min-h-[400px]">
                <Editor height="100vh" defaultLanguage = "cpp" defaultValue = {code} theme = "vs-dark"
                onChange = {setCode}
                options = {{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize:14,
                    tabSize:2,
                    minimap: {enabled:false},
                    scrollBeyondLastLine:false
                }}/>
            </div>
            <div className = "space-x-2">
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors">Save</button>
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors">Run</button>
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors">Reset</button>
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors">Graph</button>
            </div>
        </div>
    )
}