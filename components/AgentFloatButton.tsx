
import React, { useState, useRef, useEffect } from 'react';
import { AgentIcon, SendIcon, CloseIcon } from './icons';
import { ragService } from '../services/ragService';

export default function AgentFloatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string; image?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isOpen) {
        setMessages([{ type: 'bot', text: '你好！我是东里村AI导览员，你可以问我任何关于这里的问题。' }]);
    } else {
        setMessages([]);
        setInput('');
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userInput = input;
    setMessages(prev => [...prev, { type: 'user', text: userInput }]);
    setInput('');
    setIsLoading(true);

    // Simulate thinking
    await new Promise(res => setTimeout(res, 500));

    const response = await ragService.search(userInput);
    setMessages(prev => [...prev, { type: 'bot', text: response.answer, image: response.image }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-80 sm:w-96 bg-white rounded-xl shadow-2xl flex flex-col h-[70vh] max-h-[500px] border border-gray-200 animate-fade-in-up">
          <header className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 text-blue-500"><AgentIcon /></div>
              <span className="font-semibold text-gray-700">AI 讲解官</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
              <CloseIcon />
            </button>
          </header>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                {msg.type === 'bot' && <div className="w-8 h-8 text-blue-500 flex-shrink-0"><AgentIcon /></div>}
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.type === 'user' ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-gray-200 text-gray-800 rounded-bl-lg'}`}>
                  {msg.image && (
                    <img src={msg.image} alt="Related content" className="rounded-lg mb-2 w-full object-cover" />
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 text-blue-500 flex-shrink-0"><AgentIcon /></div>
                <div className="p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-lg">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t bg-white rounded-b-xl">
            <div className="flex items-center bg-gray-100 rounded-full">
              <input
                className="flex-1 w-full p-3 bg-transparent border-none rounded-full focus:ring-0"
                placeholder="问我任何问题..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className="p-2 mr-1 text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-blue-300" disabled={isLoading || !input.trim()}>
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}
      {!isOpen && (
        <button
          className="w-16 h-16 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
          onClick={() => setIsOpen(true)}
        >
          <div className="w-10 h-10"><AgentIcon /></div>
        </button>
      )}
    </div>
  );
}
