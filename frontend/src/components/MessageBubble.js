import React from 'react';

function MessageBubble({ message }) {
  const isInbound = message.direction === 'inbound';
  const style = {
    maxWidth: '70%',
    margin: '8px',
    padding: '8px 12px',
    borderRadius: '12px',
    backgroundColor: isInbound ? '#e0e0e0' : '#dcf8c6',
    alignSelf: isInbound ? 'flex-start' : 'flex-end',
    textAlign: 'left',
  };

  return (
    <div style={{ display: 'flex', justifyContent: isInbound ? 'flex-start' : 'flex-end' }}>
      <div style={style}>
        <div>{message.body}</div>
        {message.status && (
          <small style={{ fontSize: '0.7em', color: '#888' }}>
            {message.status === 'sent' && '✔️'}
            {message.status === 'delivered' && '✔️✔️'}
            {message.status === 'read' && '✔️✔️ azul'}
          </small>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;