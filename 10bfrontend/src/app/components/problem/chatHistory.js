"use client";
export const dynamic = 'force-dynamic';
import { useState,useEffect } from 'react';
import { diff } from 'react-ace';
import ReactMarkdown from 'react-markdown';
export default function ChatHistory({topic,difficulty,problemName, messages = [], setMessages, isLoading, aiAttempts, setAIAttempts})
{
    
    const [input, setInput] = useState('');
    const MAX_ATTEMPTS = 4;
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const netid = typeof window !== "undefined" ? localStorage.getItem('netid') : null;

    useEffect(() => {
        async function loadChat()
        {
            try
            {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/history`, {
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        topic:topic,
                        difficulty:difficulty,
                        problem:problemName,
                        netId: netid
                    })
                });

                if(response.ok)
                {
                        const history = await response.json();
                        if (history && history.length > 0)
                        {
                            setMessages(history.flatMap(msg => {
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
                                content: 'Welcome to CodeTrack! Ask me if you need help with your code.',
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

        if (netid && problemName) 
        {
            loadChat();
        }
    }, [problemName,topic,difficulty,netid]);

    useEffect(() => {
        async function fetchAttempts() 
        {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress/attempts?topic=${topic}&difficulty=${difficulty}&problem=${problemName}&netId=${netid}`);
            if(res.ok)
            {
                const data = await res.json();
                const lastAIAttempt = data.lastAIAttempt || 0;
                const now = Date.now();
                const hoursPassed = (now - lastAIAttempt) / (1000 * 60 * 60);
                if(hoursPassed >= 5)
                {
                    setAIAttempts(0);
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress/update`, {
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({
                        topic:topic,
                        difficulty:difficulty,
                        problem:problemName,
                        aiAttempts: 0,
                        netId: netid,
                    })
                    });
                }
                else
                {
                    setAIAttempts(data.aiAttempts || 0);
                }
            }    
        }
        if (netid && problemName) 
        {
            fetchAttempts();
        }
    },[problemName,topic,difficulty,netid]);

    const handleSend = async () => {
        if(!input.trim())
        {
            return;
        }

        if (aiAttempts >= MAX_ATTEMPTS) 
        {
            setMessages(prev => [...prev, {
                role: 'system',
                content: 'AI attempts exceeded. Please rely on test cases or wait for reset.',
                timestamp: new Date()
            }]);
            return;
        }
        await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/progress/update', 
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic,
                difficulty,
                problem:problemName,
                aiAttempts: aiAttempts + 1,
                netId: netid
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, 
            {
                method:'POST',
                headers: {'Content-Type':'application/json',},
                body: JSON.stringify({
                    topic,
                    difficulty,
                    problem:problemName,
                    prompt:input,
                    netId:netid
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

    const filtered = messages.flat().filter(msg => !(msg.content && msg.content.includes("I'm learning programming. Please analyze my code and explain: 1) What I did well, 2) What concepts I might be misunderstanding, 3) Specific improvements with examples, 4) Learning resources for areas I'm struggling with. Keep explanations beginner-friendly.")));

   return (
        <div className="flex-1 rounded-xl p-4 flex flex-col h-full w-full shadow-lg">
            <div className="flex-1 mb-3 overflow-y-auto max-h-[600px]">
            {filtered.map((msg, i) => (
                <div key={i} className={`mb-3 ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'} max-w-[70%]`}>
                <div className={`p-3 rounded-lg ${
                    msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-white rounded-bl-none'
                }`}>
                    <ReactMarkdown
                    components={{
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold text-blue-400 my-2" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-6 my-2" {...props} />,
                        code: ({node, inline, ...props}) => 
                        inline 
                            ? <code className="bg-gray-800 px-2 py-1 rounded text-sm" {...props} />
                            : <code className="block bg-gray-900 p-3 rounded my-2 overflow-x-auto text-sm font-mono whitespace-pre" {...props} />,
                        pre: ({node, ...props}) => <pre className="bg-gray-900 rounded my-2 overflow-x-auto" {...props} />,
                        p: ({node, ...props}) => <p className="my-2 whitespace-pre-wrap" {...props} />,
                    }}
                    >
                    {msg.content}
                    </ReactMarkdown>
                </div>
                <div className="text-xs text-gray-400 mt-1" suppressHydrationWarning>
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
            <div className="flex items-center gap-2 mb-4">
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { handleSend(); } }}
                className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="Ask for help (e.g. Syntax Help)"
            />
            <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`${isLoading || !input.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 cursor-pointer hover:bg-blue-700'} text-white px-5 py-3 rounded-md transition-colors font-semibold shadow`}
            >
                {isLoading ? 'Thinking...' : 'Send'}
            </button>
            </div>
        </div>
        );


}