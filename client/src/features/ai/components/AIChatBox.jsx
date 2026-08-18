import { useState } from 'react';
import Button from '../../../components/ui/Button.jsx';

export default function AIChatBox({ onSend, disabled }) {
  const [text, setText] = useState('');
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text.trim());
        setText('');
      }}
    >
      <input
        className="input"
        placeholder="Ask YatraGenie anything..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" disabled={disabled || !text.trim()}>
        Send
      </Button>
    </form>
  );
}
