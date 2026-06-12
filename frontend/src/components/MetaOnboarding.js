import React from 'react';

const MetaOnboarding = () => {
  const start = () => window.location.href = "http://localhost:3001/meta/auth/start";
  return (
    <div style={{ padding: '20px' }}>
      <h2>Conectar WhatsApp Business</h2>
      <button onClick={start}>Iniciar Onboarding Meta</button>
    </div>
   );
};

export default MetaOnboarding;