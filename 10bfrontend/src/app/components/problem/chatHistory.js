"use client";
import { useState,useEffect } from 'react';

export default function chatHistory({topic,difficulty,problemName, messages = [], setMessages, isLoading, aiAttempts, setAIAttempts})
{
    
    const [input, setInput] = useState('');
    const MAX_ATTEMPTS = 4;
    const URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        async function loadChat()
        {
            try
            {
                const response = await fetch('http://localhost:8080/api/chat/history', {
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        topic:topic,
                        difficulty:difficulty,
                        problem:problemName,
                        netId: "sduvv003"
                    })
                });

                if(response.ok)
                {
                        const history = await response.json();
                        if (history && history.length > 0)
                        {
                            setMessages(history.map(msg => {
                               const arr = [];
                                if (msg.userMessage) 
                                {
                                    arr.push(
                                    {
                                        role: 'user',
                                        content: msg.userMessage,
                                        timestamp: msg.timestamp
                                    });
                                }
                                if (msg.aiResponse) 
                                {
                                    arr.push(
                                    {
                                        role: 'system',
                                        content: msg.aiResponse,
                                        timestamp: msg.timestamp
                                    });
                                }

                                return arr;
                            }))
                        }
                        else
                        {
                            setMessages([{
                                role: 'system',
                                content: 'Welcome to CS010B Practice Portal! Ask me if you need help with your code.',
                                timestamp: null
                            }]);
                        }
                }
            }
            catch(error)
            {
                console.error("Failed to get chat history:",error);
            }
        }

        loadChat();
    }, [problemName]);

    useEffect(() => {
        async function fetchAttempts() 
        {
            const res = await fetch(`http://localhost:8080/api/progress/attempts?topic=${topic}&difficulty=${difficulty}&problem=${problemName}&netId=sduvv003`);
            if(res.ok)
            {
                const data = await res.json();
                const lastAIAttempt = data.lastAIAttempt || 0;
                const now = Date.now();
                const hoursPassed = (now - lastAIAttempt) / (1000 * 60 * 60);
                if(hoursPassed >= 5)
                {
                    setAIAttempts(0);
                    await fetch("http://localhost:8080/api/progress/update", {
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({
                        topic:topic,
                        difficulty:difficulty,
                        problem:problemName,
                        aiAttempts: 0,
                        netId: "sduvv003",
                    })
                    });
                }
                else
                {
                    setAIAttempts(data.aiAttempts || 0);
                }
            }    
        }
    },[problemName]);

    const handleSend = async () => {
        if(!input.trim())
        {
            return;
        }

        if (aiAttempts >= MAX_ATTEMPTS) 
        {
            // console.log(aiAttempts);
            setMessages(prev => [...prev, {
                role: 'system',
                content: 'AI attempts exceeded. Please rely on test cases or wait for reset.',
                timestamp: new Date()
            }]);
            return;
        }
        await fetch('http://localhost:8080/api/progress/update', 
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic,
                difficulty,
                problem:problemName,
                aiAttempts: aiAttempts + 1,
                netId: "sduvv003"
            })
        });
        setAIAttempts(aiAttempts + 1);

        const userMsg = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev,userMsg]);
        setInput('');

        try
        {
            const response = await fetch(`http://localhost:8080/api/chat`, 
            {
                method:'POST',
                headers: {'Content-Type':'application/json',},
                body: JSON.stringify({
                    topic,
                    difficulty,
                    problem:problemName,
                    prompt:input,
                    netId:"sduvv003"
                }),
            });

            if(response.ok)
            {
                const data = await response.json();
                const res = {
                    role:'system',
                    content:data.response,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev,res]);
            }
            else
            {
                console.error("API Error: ",response.status);
                setMessages(prev => [...prev, {
                    role: 'system',
                    content: 'Error processing request.',
                    timestamp: new Date()
                }]);
            }
        }
        catch(error)
        {
            console.error("Failed to send messages");
            setMessages(prev => [...prev, {
                    role: 'system',
                    content: 'Error processing request.',
                    timestamp: new Date()
            }]);
        }
    };

    const keyDown = (e) => {
        if(e.key === 'Enter' && !e.shiftKey)
        {
            e.preventDefault();
            handleSend();
        }
    }

   return (
     <div className = 'flex-1 rounded-lg p-3 flex flex-col h-full'>
        <div className = "flex-1 mb-3 overflow-y-auto max-h-[600px]">
            {messages.flat().map((msg,i) => (
                <div key = {i} className={`mb-3 ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'} max-w-[70%]`}>
                    <div className = {`p-3 rounded-lg ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-white rounded-bl-none'
                    }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                     <div className="text-xs text-gray-500 mt-1" suppressHydrationWarning>
                        {msg.role === 'user' ? 'You' : 'AI Chatbot'} - {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="mr-auto mb-3">
                    <div className="p-3 rounded-lg bg-gray-700 text-white rounded-bl-none flex items-center">
                        <div className="typing-dots">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div className = "flex items-center gap-2 mt-2">
            <input value= {input} onChange = {(e) => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { handleSend();}}}
                className = "w-full px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" placeholder="Ask for help(E.G Syntax Help)"/>  
            <button onClick = {handleSend} disabled = {isLoading || !input.trim()} className = {`${isLoading || !input.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 cursor-pointer hover:bg-blue-700'} text-white px-5 py-3 rounded-md transition-colors`}>
                {isLoading ? 'Thinking...' : 'Send'}
            </button>
        </div>

    </div>
   );


}