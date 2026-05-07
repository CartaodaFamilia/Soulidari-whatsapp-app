import React, { useState } from 'react';

function SendMessageBox({ onSend }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px', display: 'flex' }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite sua mensagem..."
        style={{ flex: 1, padding: '10px' }}
      />
      <button type="submit" style={{ padding: '10px' }}>Enviar</button>
    </form>
  );
}

export default SendMessageBox;