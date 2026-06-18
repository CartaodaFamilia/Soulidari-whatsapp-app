import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ConversationsList from './pages/ConversationsList';
import ConversationView from './pages/ConversationView';
import Contacts from './pages/Contacts';
import Templates from './pages/Templates';
import OptInManagement from './pages/OptInManagement';
import EmbeddedSignup from './pages/EmbeddedSignup';
import BusinessAccounts from './pages/BusinessAccounts';
import BulkMessaging from './pages/BulkMessaging';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Login from './pages/Login';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter basename="/app">
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />
        

        {/* Rotas protegidas com Layout */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="conversations" element={<ConversationsList />} />
          <Route path="conversation/:id" element={<ConversationView />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="templates" element={<Templates />} />
          <Route path="opt-in" element={<OptInManagement />} />
          <Route path="embedded-signup" element={<EmbeddedSignup />} />
          <Route path="business-accounts" element={<BusinessAccounts />} />
          <Route path="bulk-messaging" element={<BulkMessaging />} />
          <Route path="settings" element={<Settings />} />
           <Route path="privacy" element={<PrivacyPolicy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
