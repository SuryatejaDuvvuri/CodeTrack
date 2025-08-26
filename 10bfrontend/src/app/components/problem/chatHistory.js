"use client";
import { useState } from 'react';

export default function chatHistory()
{
    const [messages, setMessages] = useState([
    { 
      role: 'system', 
      content: 'Welcome to CS010B Practice Portal! Ask me if you need help with your code.',
      timestamp: null
    },
    {
      role: 'user',
      content: 'How do I implement the sleepIn function?',
      timestamp: null
    },
    {
      role: 'system',
      content: 'The sleepIn function should return true if it\'s not a weekday or if we\'re on vacation. In other words:\n\n```cpp\nreturn (!weekday || vacation);\n```',
      timestamp: null
    }
    ]);

    const [input, setInput] = useState('');
    const [isLoading, setLoading] = useState(false);
    const URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        async function loadChat()
        {
            try
            {
                const response = await fetch('http://localhost:8080/api/chat/history', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        problem:problem,
                        userId: "sduvv003"
                    })
                });

                if(response.ok)
                {
                    const history = await response.json();
                    if (history && history.length > 0)
                    {
                        setMessages(history.map(msg => ({
                            role:msg.role,
                            content:msg.content,
                            timestamp: new Date(msg.timestamp)
                        })))
                    }
                }
            }
            catch(error)
            {
                console.error("Failed to get chat history:",error);
            }
        }

        loadChat();
    }, [problem]);

    const handleSend = async () => {
        if(!input.trim())
        {
            return;
        }

        const userMsg = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev,userMsg]);
        setInput('');
        setLoading(true);

        try
        {

        }
        catch(error)
        {
            console.error("Failed to send messages");
        }
    }

   return (
     <div className = 'flex-1 rounded-lg p-4 flex flex-col h-full mt-16'>
        <div className = "flex-1 mb-6">
            {messages.map((msg,i) => (
                <div key = {i} className={`mb-4 ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                    <div className = {`p-3 rounded-lg ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-white rounded-bl-none'
                    }`}>
                        {msg.content}
                    </div>
                     <div className="text-xs text-gray-500 mt-auto" suppressHydrationWarning>
                        {msg.role === 'user' ? 'You' : 'AI Chatbot'} - {new Date().toLocaleTimeString()}
                    </div>
                </div>
            ))}
        </div>
        <div className = "flex items-center gap-2">
            <input value= {input} onChange = {(e) => setInput(e.target.value)}
                className = "w-full px-3 py-2 rounded bg-gray-500 text-white" placeholder="Ask for help(E.G Syntax Help)"/>  
            <button className = "bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Send
            </button>
        </div>
    </div>
   );


}