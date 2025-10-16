import React, { useState, useRef, useEffect } from 'react';
import { LuSend, LuBot, LuUser, LuGlobe } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATH.CHAT.SEND_MESSAGE, {
        message: inputMessage,
        language: selectedLanguage
      });

      if (response.data.success) {
        const botMessage = { text: response.data.reply, sender: 'bot' };
        setMessages(prev => [...prev, botMessage]);
      } else {
        toast.error('Failed to get response from Finance Buddy');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout activeMenu="Finance Buddy">
      <div className='my-5'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h1 className='text-2xl font-bold text-gray-800'>Finance Buddy</h1>

          {/* Language Selector */}
          <div className='flex items-center gap-2'>
            <LuGlobe className='text-gray-600' />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className='px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary'
            >
              <option value='english'>English</option>
              <option value='hinglish'>Hinglish</option>
            </select>
          </div>
        </div>

        <div className='mt-6 bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] flex flex-col'>
          {/* Chat Messages */}
          <div className='flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4'>
            {messages.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                <LuBot className='text-6xl mb-4 text-primary' />
                <h3 className='text-xl font-semibold mb-2'>Welcome to Finance Buddy!</h3>
                <p className='text-center max-w-md'>
                  I'm your personal financial assistant. Ask me anything about your finances,
                  budgeting tips, or insights based on your data!
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0'>
                      <LuBot className='text-white text-sm' />
                    </div>
                  )}
                  <div
                    className={`max-w-xs sm:max-w-sm md:max-w-md px-3 md:px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className='whitespace-pre-wrap text-sm md:text-base'>{msg.text}</p>
                  </div>
                  {msg.sender === 'user' && (
                    <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0'>
                      <LuUser className='text-gray-600 text-sm' />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0'>
                  <LuBot className='text-white text-sm' />
                </div>
                <div className='bg-gray-100 px-3 md:px-4 py-2 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <div className='flex space-x-1'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                      <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0.1s' }}></div>
                      <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className='text-xs text-gray-500 ml-2'>Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className='border-t border-gray-200 p-3 md:p-4'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Ask Finance Buddy anything...'
                className='flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className='px-3 md:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                <LuSend className='text-sm' />
                <span className='hidden sm:inline'>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
