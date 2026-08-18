import { useState } from 'react';
import { aiApi } from '../ai.api.js';

export function useAIChat(tripId) {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const send = async (text) => {
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await aiApi.chat({ message: text, conversationId, tripId });
      setConversationId(res.conversationId);
      setMessages((m) => [...m, { role: 'assistant', content: res.reply, actions: res.actions, cards: res.cards }]);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, send };
}
