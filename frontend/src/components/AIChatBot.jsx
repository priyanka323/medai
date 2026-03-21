import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2} from 'lucide-react';   //if add , Maximize2 
import { api } from '../services/api';
import toast from 'react-hot-toast';

export default function AIChatBot({ onRecommendation }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hello! I\'m your medical assistant. I can help you:\n\n• Calculate medicine doses\n• Explain clinical calculators\n• Provide medication information\n\nTry: "Calculate dose for 20kg child paracetamol" or ask about our calculators!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      // First try to parse dose request
      const parsed = await api.parseDoseRequest(userMessage);
      
      if (parsed.medicine && parsed.weight) {
        // It's a dose calculation request
        const doseResult = await api.calculateDose({
          medicine_id: parsed.medicine,
          weight_kg: parsed.weight,
          age_months: parsed.age ? (parsed.age_unit === 'years' ? parsed.age * 12 : parsed.age) : 12
        });
        
        const response = `✅ I've calculated the dose for ${doseResult.medicine}:\n\n• Single dose: ${doseResult.dosing.final_dose_mg} mg\n• Frequency: ${doseResult.dosing.frequency}\n• Daily total: ${doseResult.dosing.daily_dose_mg} mg\n\n${doseResult.warnings.length > 0 ? '⚠️ ' + doseResult.warnings.join(' • ') : '✓ Dose appears safe.'}\n\nWould you like to use this medication?`;
        
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        
        if (onRecommendation) {
          onRecommendation({ medicine: { id: parsed.medicine, name: doseResult.medicine }, reasoning: `Calculated based on weight: ${parsed.weight}kg` });
        }
      } else {
        // Regular chat
        const response = await api.chatMessage(userMessage);
        setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
      }
    } catch (error) {
      toast.error('Failed to process request');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition z-50"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-white" />
          <span className="font-semibold text-white">AI Medical Assistant</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:text-gray-200 transition"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:text-gray-200 transition md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={chatContainerRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`rounded-full p-1.5 ${msg.role === 'user' ? 'bg-blue-500' : 'bg-gray-500'}`}>
                {msg.role === 'user' ? <User className="h-3 w-3 text-white" /> : <Bot className="h-3 w-3 text-white" />}
              </div>
              <div className={`rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}>
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="rounded-full p-1.5 bg-gray-500">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows="1"
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          💡 Try: "Calculate dose for 20kg child paracetamol"
        </p>
      </div>
    </div>
  );
}