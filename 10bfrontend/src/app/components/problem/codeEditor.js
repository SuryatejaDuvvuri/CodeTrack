"use client"
import {useEffect, useState, useRef} from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import ProgressGraph from "./progressGraph.js";

export default function CodeEditor({defaultCode, code,setCode,handleRun, saveCode, toggle, showGraph, setStartTime})
{
    const editorRef = useRef(null);

    const handleEditor = (editor,m) => 
    {
        editorRef.current = editor;
        if(m)
        {
            editor.onDidFocusEditorWidget(() => {
                if(setStartTime)
                {
                    setStartTime(Date.now());
                }
            })
            editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.KeyC, () => 
            {
                console.log('No Copying');
            });

            editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.KeyV, () => 
            {
                console.log("No Pasting");
            });
        }
    };

    const handleReset = () => 
    {
        setCode(defaultCode);
    };

    useEffect(() => 
    {
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
                <AceEditor
                mode="c_cpp"
                theme="monokai"
                value={typeof code === "string" ? code : (typeof defaultCode === "string" ? defaultCode : "")}
                onChange={setCode}
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
                width="100%"
                height="400px"
                />
            </div>
            <div className = "space-x-2">
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors" onClick = {saveCode}>Save</button>
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors" onClick = {handleRun}>Run</button>
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors" onClick = {handleReset}>Reset</button>
                <button className = "px-3 py-1 bg-gray-300 text-black rounded transition-colors" onClick = {toggle}>{showGraph ? "Hide Graph" : "Show Graph"}</button>
            </div>
        </div>
    )
}