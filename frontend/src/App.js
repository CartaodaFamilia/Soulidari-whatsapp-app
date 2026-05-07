import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ConversationView from './pages/ConversationView';
import Templates from './pages/Templates';
import OptInManagement from './pages/OptInManagement';
import EmbeddedSignup from './pages/EmbeddedSignup';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/conversations" element={<Navigate to="/" replace />} />
          <Route path="/conversation/:id" element={<ConversationView />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/opt-in" element={<OptInManagement />} />
          <Route path="/embedded-signup" element={<EmbeddedSignup />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
