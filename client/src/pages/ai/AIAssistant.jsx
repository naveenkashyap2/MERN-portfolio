import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import AIChatBox from '../../features/ai/components/AIChatBox.jsx';
import AIMessage from '../../features/ai/components/AIMessage.jsx';
import AIThinking from '../../features/ai/components/AIThinking.jsx';
import AIQuickActions from '../../features/ai/components/AIQuickActions.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAIChat } from '../../features/ai/hooks/useAIChat.js';
import { aiApi } from '../../features/ai/ai.api.js';
import { toast } from '../../store/ui.store.js';

const LATE = [
  "I'm running late",
  'I missed my transport',
  'I want fewer places',
  'I need a cheaper plan',
  'I want to skip this stop',
];

export default function AIAssistant() {
  const [params] = useSearchParams();
  const tripId = params.get('tripId');
  const { messages, loading, send } = useAIChat(tripId);
  const [late, setLate] = useState(false);
  const navigate = useNavigate();

  const onPick = async (action) => {
    if (action.id === 'late') {
      setLate(true);
      return;
    }
    const map = {
      optimize: 'Optimize my current trip for less walking.',
      reduce: 'Budget kam kar do, important places rakho.',
      nearby: 'Nearby koi achha gurudwara ya temple hai?',
      hotel: 'Is hotel ko replace karo with a cheaper area.',
      temple: 'Add famous temples to the plan.',
      gurudwara: 'Add gurudwaras to the plan.',
      replan: 'Replan the remaining day.',
    };
    await send(map[action.id] || action.label);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold">YatraGenie AI ✨</h1>
          <p className="text-sm text-ink-mute">Your personal travel assistant</p>
        </div>
        <AIQuickActions onPick={onPick} />
        <div className="card flex min-h-[420px] flex-col gap-3 p-5">
          {!messages.length && (
            <p className="text-sm text-ink-mute">Ask about nearby temples, a cheaper budget, or say you’re late.</p>
          )}
          {messages.map((m, i) => (
            <AIMessage key={i} role={m.role}>
              {m.content}
            </AIMessage>
          ))}
          {loading && <AIThinking />}
          <div className="mt-auto pt-4">
            <AIChatBox onSend={send} disabled={loading} />
          </div>
        </div>
      </div>
      <Modal open={late} title="What's happening?" onClose={() => setLate(false)}>
        <div className="space-y-2">
          {LATE.map((opt) => (
            <Button
              key={opt}
              variant="secondary"
              className="w-full justify-start"
              onClick={async () => {
                setLate(false);
                if (tripId) {
                  await aiApi.replan(tripId, opt);
                  toast('Itinerary revised.', 'success');
                  navigate(`/trips/${tripId}`);
                } else {
                  await send(opt);
                }
              }}
            >
              {opt}
            </Button>
          ))}
        </div>
      </Modal>
    </DashboardLayout>
  );
}
