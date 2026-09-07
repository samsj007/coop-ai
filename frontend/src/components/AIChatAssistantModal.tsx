import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User as UserIcon } from 'lucide-react';
import { api } from '../api/client';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectSuggestedService: (service: string, issue: string) => void;
}

export const AIChatAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectSuggestedService,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; suggested?: string }>>([
    {
      sender: 'ai',
      text: "Hello! I'm your COOP AI Service Assistant. Describe what's happening at home in plain words (e.g. 'Water is leaking from kitchen tap' or 'Need AC serviced'), and I'll identify the best provider for you!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.chatAssistant(userText, messages);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.reply,
          suggested: res.suggested_service,
        },
      ]);

      if (res.suggested_service && res.suggested_issue) {
        onSelectSuggestedService(res.suggested_service, res.suggested_issue);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'I can help identify your service category directly. Please choose from our available service categories.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col h-[520px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-1.5">
                COOP AI Assistant <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              </h3>
              <p className="text-xs text-indigo-100">Natural Language Service Helper</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  AI
                </div>
              )}
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold p-2">
              <Sparkles className="w-4 h-4 animate-spin" /> Analyzing problem with Gemini AI...
            </div>
          )}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your household issue..."
            className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
