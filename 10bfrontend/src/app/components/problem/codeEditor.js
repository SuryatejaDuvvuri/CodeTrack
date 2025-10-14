"use client"
import {useEffect, useState, useRef} from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { dracula } from '@uiw/codemirror-theme-dracula';
import ProgressGraph from "./progressGraph.js";

export default function CodeEditor({defaultCode, code,setCode,handleRun, saveCode, toggle, showGraph, setStartTime, readOnly})
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
        <div className="flex-1 bg-gray-900 rounded-xl p-6 flex flex-col h-full w-full mx-auto border border-gray-700 shadow-lg">
            <div className="flex-1 mb-4 min-h-[600px]">
            <CodeMirror
                value={code}
                height="600px"
                theme={dracula}
                extensions={[cpp()]}
                onChange={(value) => setCode(value)}
            />
            </div>
            {!readOnly && (
            <div className="space-x-2 flex flex-wrap">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all font-semibold" onClick={saveCode}>Save</button>
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 transition-all font-semibold" onClick={handleRun}>Run</button>
                <button className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-all font-semibold" onClick={handleReset}>Reset</button>
                <button className="px-4 py-2 bg-gray-700 text-blue-300 rounded-lg shadow hover:bg-gray-600 hover:text-white transition-all font-semibold" onClick={toggle}>
                {showGraph ? "Hide Graph" : "Show Graph"}
                </button>
            </div>
            )}
        </div>
    )
}