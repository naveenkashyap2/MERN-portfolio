import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Plus, Trash2, MessageSquare } from 'lucide-react';
import { assistantApi, tripsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import AIChatBox from '../components/ai/AIChatBox';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { cn } from '../utils/cn';

export default function Assistant() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [tripId, setTripId] = useState('');
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: conversationsData } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => assistantApi.conversations(),
  });
  const { data: tripsData } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripsApi.list(),
  });

  const deleteConversation = useMutation({
    mutationFn: (id) => assistantApi.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setActiveConversation(null);
      toast.success('Conversation deleted.');
    },
  });

  const conversations = conversationsData?.conversations || [];
  const trips = tripsData?.trips || [];

  const startNew = () => setActiveConversation({ id: null, title: 'New conversation' });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600 to-cyan flex items-center justify-center">
          <Sparkles size={22} className="text-white" />
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">YatraGenie AI ✨</h1>
          <p className="text-muted text-sm">Your personal travel assistant</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5" style={{ height: 'calc(100vh - 200px)', minHeight: 560 }}>
        {/* Conversations sidebar */}
        <div className="hidden lg:flex flex-col card p-3">
          <Button variant="secondary" size="sm" icon={Plus} className="mb-3" onClick={startNew}>New chat</Button>
          <div className="flex-1 overflow-y-auto space-y-1">
            {conversations.length === 0 && (
              <p className="text-xs text-muted text-center py-6">No conversations yet.</p>
            )}
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConversation({ id: c.id, title: c.title })}
                className={cn('w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-left transition-colors group', activeConversation?.id === c.id ? 'bg-brand-500/10 text-body' : 'text-muted hover:text-body hover:bg-white/[0.04]')}
              >
                <MessageSquare size={14} className="shrink-0" />
                <span className="flex-1 truncate">{c.title}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteConversation.mutate(c.id); }} className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger" aria-label="Delete conversation">
                  <Trash2 size={13} />
                </button>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col">
          <AIChatBox
            tripId={tripId || undefined}
            conversationId={activeConversation?.id}
            initialMessages={[]}
          />
        </div>

        {/* Context panel */}
        <div className="hidden lg:block">
          <div className="card p-5">
            <h3 className="font-semibold text-body mb-3 text-sm">Trip context</h3>
            <Select value={tripId} onChange={(e) => setTripId(e.target.value)}>
              <option value="">No active trip</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>{t.origin} → {t.destination}</option>
              ))}
            </Select>
            <p className="text-xs text-muted mt-3">Select a trip so the AI can help with its budget, itinerary and nearby places.</p>
          </div>
          <div className="card p-5 mt-4">
            <h3 className="font-semibold text-body mb-3 text-sm">Try asking</h3>
            <ul className="space-y-2 text-xs text-muted">
              {['“Nearby koi achha gurudwara hai?”', '“Budget 5000 se 3500 kar do.”', '“Kal train se jana hai.”', '“Mere paas sirf 3 hours hain.”', '“Is hotel ko replace karo.”'].map((t) => (
                <li key={t} className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
