import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { XMarkIcon } from './Icons';

interface ChatbotProps {
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start with a welcome message
    setMessages([
      {
        role: 'model',
        content: "Namaste! I am your ASHA Helper. How can I assist you today? You can ask me about symptoms, first aid, or nutrition.",
      },
    ]);
  }, []);
  
  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', content: userInput };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(messages, userInput);
      const modelMessage: ChatMessage = { role: 'model', content: response };
      setMessages([...newMessages, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'model',
        content: "Sorry, I couldn't get a response. Please check your connection and try again.",
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSend();
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col h-full w-full max-w-2xl bg-light-bg dark:bg-dark-bg shadow-2xl rounded-lg">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-primary">ASHA Helper</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content.replace(/\*/g, '')}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-lg p-3 rounded-2xl bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-full bg-slate-50 dark:bg-slate-700 focus:ring-primary focus:border-primary"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !userInput.trim()}
              className="p-3 bg-primary text-white rounded-full disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;