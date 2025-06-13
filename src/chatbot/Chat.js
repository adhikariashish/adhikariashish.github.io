import React, { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! Ask me anything.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { type: 'user', text: input }];

    // Fake response logic
    const reply = {
      type: 'bot',
      text: `You said: "${input}". I'll reply better soon!`
    };

    setMessages([...newMessages, reply]);
    setInput('');
  };

  return (
    <div>
      <div style={{ background: '#f1f1f1', padding: '1rem', borderRadius: '8px', minHeight: '200px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <strong>{msg.type === 'bot' ? 'Bot' : 'You'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '80%' }}
        />
        <button onClick={handleSend} style={{ marginLeft: '1rem' }}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
