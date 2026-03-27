import React, { useEffect, useRef, useState } from 'react';
import { LuBot, LuGlobe, LuSend, LuUser } from 'react-icons/lu';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';

const STARTER_PROMPTS = [
  'How much did I spend this month?',
  'Am I over budget anywhere?',
  'What is my biggest expense category?',
  'How can I save more money?',
];

const BOT_MODE_LABELS = {
  direct: 'Exact answer',
  assistant: 'AI coach',
};

const Chat = () => {
  useUserAuth();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText) => {
    const normalizedMessage = String(messageText || '').trim();

    if (!normalizedMessage) return;

    const userMessage = { text: normalizedMessage, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATH.CHAT.SEND_MESSAGE, {
        message: normalizedMessage,
        language: selectedLanguage,
      });

      if (response.data.success) {
        const botMessage = {
          text: response.data.reply,
          sender: 'bot',
          mode: response.data.mode || 'assistant',
          fallback: Boolean(response.data.fallback),
          rangeLabel: response.data.rangeLabel || '',
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        toast.error('Failed to get response from Finance Buddy');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    await sendMessage(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout activeMenu="Finance Buddy">
      <div className='page-shell'>
        <div className='card flex min-h-[calc(100dvh-8.4rem)] flex-col overflow-hidden sm:min-h-[calc(100dvh-9rem)] lg:min-h-[calc(100dvh-9.5rem)]'>
          <div className='border-b border-slate-200/80 px-4 py-4 sm:px-5 sm:py-5 md:px-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400'>Assistant</p>
                <h1 className='mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl'>Finance Buddy</h1>
                <p className='mt-1.5 text-[13px] leading-6 text-slate-500 sm:text-sm'>
                  Ask for exact spending and budget answers, or use it like a money coach for next-step advice.
                </p>
              </div>

              <div className='flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5 sm:w-auto'>
                <LuGlobe className='text-slate-500 text-base flex-shrink-0' />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className='min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none sm:flex-none'
                >
                  <option value='english'>English</option>
                  <option value='hinglish'>Hinglish</option>
                </select>
              </div>
            </div>
          </div>

          <div className='flex-1 flex flex-col overflow-hidden'>
            <div className='flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 sm:px-4 sm:py-4 md:px-6'>
              <div className='max-w-full space-y-2.5 sm:space-y-3'>
                {messages.length === 0 ? (
                  <div className='flex h-full flex-col items-center justify-center px-4 py-6 text-gray-500'>
                    <LuBot className='mb-3 text-4xl text-primary md:mb-4 md:text-6xl' />
                    <h3 className='mb-1 text-lg font-semibold text-center md:mb-2 md:text-xl'>
                      Welcome to Finance Buddy!
                    </h3>
                    <p className='max-w-md text-center text-[13px] leading-6 sm:text-sm md:text-base'>
                      I can answer exact questions about spending, budgets, and recent activity, then switch to coaching mode for planning and savings advice.
                    </p>
                    <div className='mt-5 flex w-full max-w-2xl flex-wrap justify-center gap-2'>
                      {STARTER_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type='button'
                          onClick={() => sendMessage(prompt)}
                          disabled={isLoading}
                          className='rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm'
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
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
                        className={`max-w-[82%] sm:max-w-[72%] md:max-w-md lg:max-w-lg px-3 py-2 md:px-4 md:py-2.5 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-primary text-white rounded-tr-md'
                            : 'bg-gray-100 text-gray-800 rounded-tl-md'
                        }`}
                      >
                        {msg.sender === 'bot' && (
                          <div className='mb-1.5 flex items-center gap-2'>
                            <span className='rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500'>
                              {msg.fallback ? 'Fallback' : (BOT_MODE_LABELS[msg.mode] || 'Finance Buddy')}
                            </span>
                            {msg.rangeLabel && (
                              <span className='text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400'>
                                {msg.rangeLabel}
                              </span>
                            )}
                          </div>
                        )}
                        <p className='whitespace-pre-wrap break-words text-[13px] leading-6 sm:text-sm md:text-base'>
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
                    <div className='bg-gray-100 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl rounded-tl-md'>
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
            </div>

            <div className='border-t border-slate-200/80 bg-white px-3 py-3 sm:px-4 sm:py-4 md:px-6 flex-shrink-0'>
              <div className='flex gap-2 max-w-full items-end'>
                <input
                  type='text'
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder='Ask about spend, budgets, savings, or recent transactions...'
                  className='flex-1 min-w-0 rounded-2xl border border-slate-200/80 px-3 py-2.5 text-[13px] text-slate-800 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.25)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50 disabled:text-gray-500 sm:px-4 sm:text-sm md:text-base'
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className='rounded-2xl bg-primary px-3 py-2.5 text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:px-4 md:px-5 md:py-3 transition-colors flex-shrink-0'
                >
                  <LuSend className='text-sm md:text-base' />
                  <span className='hidden sm:inline text-sm md:text-base'>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
