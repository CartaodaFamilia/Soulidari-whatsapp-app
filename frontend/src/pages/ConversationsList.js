import React, { useState, useEffect } from 'react';
import { Search, Send } from 'lucide-react';
import { getConversations } from '../services/api';
import ConversationView from './ConversationView';

const TABS = [
  { key: 'all', label: 'Todas' },
  { key: 'open', label: 'Abertas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'closed', label: 'Fechadas' },
];

function ConversationsList() {
  const [conversations, setConversations] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    getConversations()
      .then(res => { setConversations(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = conversations.filter(c => {
    if (search && !(c.contact_wa_id.includes(search) || (c.profile_name || '').toLowerCase().includes(search.toLowerCase()))) return false;
    if (activeTab === 'pending') return false;
    if (activeTab === 'closed') return false;
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Painel esquerdo - Lista */}
      <div className="w-full md:w-96 flex flex-col border-r border-gray-100 flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Conversas</h1>
          <p className="text-sm text-gray-400 mb-3">Gerencie suas conversas do WhatsApp</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div className="flex gap-1 mt-3">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === tab.key ? 'bg-green-50 text-green-700 border border-green-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-center py-8 text-gray-400 text-sm">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-gray-400 text-sm">Nenhuma conversa encontrada.</p>
          ) : (
            filtered.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${
                  selectedId === conv.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                }`}
              >
                <div className="w-11 h-11 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0">
                  {(conv.profile_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{conv.profile_name || conv.contact_wa_id}</h3>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{conv.last_message || 'Sem mensagens'}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Painel direito - Conversa ou placeholder */}
      <div className="flex-1 hidden md:flex flex-col">
        {selectedId ? (
          <ConversationView id={selectedId} embedded />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <Send size={28} className="text-green-400" />
            </div>
            <p className="text-gray-600 font-medium">Selecione uma conversa</p>
            <p className="text-gray-400 text-sm mt-1">Escolha uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationsList;