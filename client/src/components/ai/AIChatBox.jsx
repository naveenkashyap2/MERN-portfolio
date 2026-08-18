import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Paperclip, Mic } from 'lucide-react';
import { assistantApi } from '../../services/api';
import AIMessage from './AIMessage';
import AIQuickActions from './AIQuickActions';
import Spinner from '../ui/Spinner';

export default function AIChatBox({ tripId, conversationId, initialMessages = [], onQuickAction, className }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [convoId, setConvoId] = useState(conversationId || null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: async (message) => assistantApi.chat({ message, conversationId: convoId, tripId }),
    onMutate: (message) => {
      setMessages((m) => [...m, { id: `local_${Date.now()}`, role: 'user', content: message, kind: 'text', data: null }]);
    },
    onSuccess: (data) => {
      setConvoId(data.conversationId);
      setMessages((m) => [...m, data.message]);
    },
  });

  const send = (text) => {
    const trimmed = text.trim();
    if (!trimmed || sendMutation.isPending) return;
    setInput('');
    sendMutation.mutate(trimmed);
  };

  const handleQuickAction = (action) => {
    if (onQuickAction) onQuickAction(action);
    else send(action.label);
  };

  return (
    <div className={`flex flex-col h-full ${className || ''}`}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-muted">Ask YatraGenie anything about your trip.</p>
            <p className="text-xs text-muted/70 mt-1">Try “budget kam karo”, “paas mein gurudwara”, or “I'm late”.</p>
          </div>
        )}
        {messages.map((m) => (
          <AIMessage key={m.id} message={m} />
        ))}
        {sendMutation.isPending && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Spinner size={15} /> AI is thinking…
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/[0.08]">
        <AIQuickActions onAction={handleQuickAction} />
        <div className="flex items-end gap-2 mt-2">
          <div className="flex-1 rounded-2xl bg-ink-800/70 border border-white/10 focus-within:border-brand-400/60 transition-colors px-3 py-2 flex items-center gap-2">
            <button className="text-muted hover:text-body" aria-label="Attach"><Paperclip size={16} /></button>
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask YatraGenie anything…"
              className="flex-1 bg-transparent text-sm text-body placeholder:text-muted/60 resize-none outline-none max-h-28"
            />
            <button className="text-muted hover:text-body" aria-label="Voice (coming soon)"><Mic size={16} /></button>
          </div>
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || sendMutation.isPending}
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-600 to-cyan text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
