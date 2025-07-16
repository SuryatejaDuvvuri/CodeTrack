"use client";
import { useState } from 'react';

export default function chatHistory()
{
    const [messages, setMessages] = useState([
    { 
      role: 'system', 
      content: 'Welcome to CS010B Practice Portal! Ask me if you need help with your code.'
    },
    {
      role: 'user',
      content: 'How do I implement the sleepIn function?'
    },
    {
      role: 'system',
      content: 'The sleepIn function should return true if it\'s not a weekday or if we\'re on vacation. In other words:\n\n```cpp\nreturn (!weekday || vacation);\n```'
    }
    ]);

    const [input, setInput] = useState('');

    const handleSend = () => {
        if(input.trim() == '') 
        {
            return
        }

        setMessages([...messages, {role:'user', content:input}]);
        setInput('');

        setTimeout(() => {
            setMessages(previous => [...previous, , {
                role: 'system', 
                content: `I'll help you with "${input}". What specific part are you struggling with?` 
            }]);
        },1000)
    };

   return (
     <div className = 'flex-1 bg-gray-700 rounded-lg p-4 flex flex-col h-full'>
        <div className = "flex-1 mb-4 min-h-[400px]">
            {messages.map((msg,i) => (
                <div key = {i} className={`mb-4 ${msg.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'}`}>
                    <div className = {`p-3 rounded-lg ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-white rounded-bl-none'
                    }`}>
                        {msg.content}
                    </div>
                     <div className="text-xs text-gray-500 mt-1">
                        {msg.role === 'user' ? 'You' : 'AI Assistant'} - {new Date().toLocaleTimeString()}
                    </div>
                </div>
            ))}
        </div>
        <div className = "flex items-center gap-2">
            <input value= {input} onChange = {(e) => setInput(e.target.value)} onKeyPress = {(e) => e.key === 'Enter' && handleSend()} 
                className = "w-full px-3 py-2 rounded bg-gray-500 text-white" placeholder="Ask for help(E.G Syntax Help)"/>  
            <button onClick = {handleSend} className = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Send
            </button>
        </div>
    </div>
   );


}