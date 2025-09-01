"use client"
import {useEffect, useState, useRef} from 'react';
import Editor from '@monaco-editor/react'

export default function codeEditor({code,setCode,handleRun})
{

    const editorRef = useRef(null);

    const handleEditor = (editor,m) => 
    {
        editorRef.current = editor;
        editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.KeyC, () => 
        {
            console.log('No Copying');
        });

        editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.KeyV, () => 
        {
            console.log("No Pasting");
        });
    };

    useEffect(() => {
        const disableCopyPaste = (e) => 
        {
            e.preventDefault();
            console.log('No Copying/Pasting');
            return false;
        }

        document.addEventListener('copy',disableCopyPaste);
        document.addEventListener('paste',disableCopyPaste);

        return () => 
        {
            document.removeEventListener('copy',disableCopyPaste);
            document.removeEventListener('paste',disableCopyPaste);
        }
    },[]);
    

    return (
        <div className = "flex-1 bg-gray-800 rounded-lg p-4 flex flex-col h-full">
            <div className = "flex-1 mb-4 min-h-[400px]">
                <Editor height="100vh" defaultLanguage = "cpp" defaultValue = {code} theme = "vs-dark"
                onChange = {setCode}
                onMount={handleEditor}
                options = {{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize:14,
                    tabSize:2,
                    minimap: {enabled:false},
                    scrollBeyondLastLine:false,
                    contextmenu:false
                }}/>
            </div>
            <div className = "space-x-2">
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors">Save</button>
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors" onClick = {handleRun}>Run</button>
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors">Reset</button>
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors">Graph</button>
            </div>
        </div>
    )
}