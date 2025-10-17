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
      <div className='px-3 sm:px-4 md:px-6 py-3 md:py-5'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6'>
          <h1 className='text-xl md:text-2xl font-bold text-gray-800'>Finance Buddy</h1>

          {/* Language Selector */}
          <div className='flex items-center gap-2 w-full sm:w-auto'>
            <LuGlobe className='text-gray-600 text-base md:text-lg flex-shrink-0' />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className='flex-1 sm:flex-none px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary'
            >
              <option value='english'>English</option>
              <option value='hinglish'>Hinglish</option>
            </select>
          </div>
        </div>

        {/* Chat Container */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] flex flex-col'>
          {/* Chat Messages */}
          <div className='flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 space-y-2 md:space-y-3'>
            {messages.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-gray-500 px-4'>
                <LuBot className='text-4xl md:text-6xl mb-3 md:mb-4 text-primary' />
                <h3 className='text-lg md:text-xl font-semibold mb-1 md:mb-2 text-center'>
                  Welcome to Finance Buddy!
                </h3>
                <p className='text-xs sm:text-sm md:text-base text-center max-w-md'>
                  I'm your personal financial assistant. Ask me anything about your finances,
                  budgeting tips, or insights based on your data!
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 md:gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className='w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0'>
                      <LuBot className='text-white text-xs md:text-sm' />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] sm:max-w-[70%] md:max-w-md lg:max-w-lg px-3 md:px-4 py-2 md:py-2.5 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className='whitespace-pre-wrap text-xs sm:text-sm md:text-base break-words'>
                      {msg.text}
                    </p>
                  </div>
                  {msg.sender === 'user' && (
                    <div className='w-7 h-7 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0'>
                      <LuUser className='text-gray-600 text-xs md:text-sm' />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className='flex items-start gap-2 md:gap-3'>
                <div className='w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0'>
                  <LuBot className='text-white text-xs md:text-sm' />
                </div>
                <div className='bg-gray-100 px-3 md:px-4 py-2 md:py-2.5 rounded-lg rounded-tl-none'>
                  <div className='flex items-center gap-2'>
                    <div className='flex space-x-1'>
                      <div className='w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce'></div>
                      <div className='w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0.1s' }}></div>
                      <div className='w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className='text-xs text-gray-500 ml-1 md:ml-2'>Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className='border-t border-gray-200 p-2 sm:p-3 md:p-4'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Ask Finance Buddy anything...'
                className='flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500'
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className='px-3 sm:px-4 md:px-5 py-2 md:py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 md:gap-2 transition-colors flex-shrink-0'
              >
                <LuSend className='text-sm md:text-base' />
                <span className='hidden sm:inline text-sm md:text-base'>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
