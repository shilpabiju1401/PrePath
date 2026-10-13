import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../services/api';
import PipOwl from '../components/mascots/PipOwl';
import BloopBlob from '../components/mascots/BloopBlob';
import { Send, Bot, Sparkles, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AIBuddyPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hi there! I'm Pip, your PrepPath AI Buddy. 🦉 Ask me anything about Aptitude, Reasoning, Verbal, or Coding concepts and bugs!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/ask', { question: userText });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      console.error('AI Buddy request error:', err);
      const serverMsg = err.response?.data?.message;
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: serverMsg 
          ? `⚠️ ${serverMsg}`
          : "I'm having a little trouble connecting right now. Please ensure the backend is running and an AI key is set in your preppath-backend/.env file!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-50 to-purple-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                Pip & Bloop <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">AI Mentor</span>
              </h1>
              <p className="text-xs text-slate-500">Placement Preparation Assistant</p>
            </div>
          </div>
          <PipOwl size={42} mood="happy" />
        </div>

        {/* Message Log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                ${m.sender === 'user' ? 'bg-slate-700 text-white' : 'bg-brand-600 text-white'}`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
                ${m.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none whitespace-pre-wrap'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
                {m.sender === 'user' ? (
                  m.text
                ) : (
                  <div className="prose prose-sm max-w-none text-slate-800">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-3 rounded-xl border border-slate-200 shadow-xs">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-xs bg-white" {...props} />
                          </div>
                        ),
                        thead: ({ node, ...props }) => <thead className="bg-slate-100 font-bold text-slate-800" {...props} />,
                        th: ({ node, ...props }) => <th className="px-3.5 py-2.5 border-b border-slate-200 font-semibold" {...props} />,
                        td: ({ node, ...props }) => <td className="px-3.5 py-2 border-b border-slate-100 text-slate-700" {...props} />,
                        tr: ({ node, ...props }) => <tr className="hover:bg-slate-50/80 transition-colors" {...props} />,
                        pre: ({ node, ...props }) => (
                          <pre className="bg-slate-900 text-slate-100 p-3.5 rounded-xl overflow-x-auto text-xs font-mono my-2.5 border border-slate-800 shadow-sm leading-relaxed" {...props} />
                        ),
                        code: ({ node, inline, ...props }) =>
                          inline ? (
                            <code className="bg-slate-100 text-brand-700 px-1.5 py-0.5 rounded font-mono text-xs font-semibold" {...props} />
                          ) : (
                            <code {...props} />
                          ),
                        h1: ({ node, ...props }) => <h1 className="text-base font-extrabold text-slate-900 mt-3.5 mb-1.5" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-sm font-bold text-slate-900 mt-3 mb-1" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xs font-bold text-slate-900 mt-2 mb-1" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 text-slate-700" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2 text-slate-700" {...props} />,
                        li: ({ node, ...props }) => <li className="text-slate-700 leading-normal" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-2.5 last:mb-0 leading-relaxed text-slate-800" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-4 border-brand-500 pl-3 my-2 text-slate-600 italic bg-brand-50/60 py-1.5 rounded-r-lg" {...props} />
                        ),
                        hr: ({ node, ...props }) => <hr className="my-3 border-slate-200" {...props} />
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Pip is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a doubt e.g., 'How do I solve percentage decrease problems?'"
            className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center gap-2 text-sm shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
