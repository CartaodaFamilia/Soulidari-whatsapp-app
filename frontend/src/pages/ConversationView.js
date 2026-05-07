import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  ChevronLeft, 
  Phone, 
  Video,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';
import { getConversation, getMessages, sendMessage } from '../services/api';

const MessageBubble = ({ message }) => {
  const isOutbound = message.direction === 'outbound';
  
  const StatusIcon = () => {
    if (!isOutbound) return null;
    switch (message.status) {
      case 'sent': return <Check size={14} className="text-gray-400" />;
      case 'delivered': return <CheckCheck size={14} className="text-gray-400" />;
      case 'read': return <CheckCheck size={14} className="text-blue-500" />;
      default: return <Clock size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
        isOutbound 
          ? 'bg-green-600 text-white rounded-tr-none' 
          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
      }`}>
        <p className="text-sm leading-relaxed">{message.body}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${isOutbound ? 'text-green-100' : 'text-gray-400'}`}>
          <span className="text-[10px]">
            {new Date(message.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <StatusIcon />
        </div>
      </div>
    </div>
  );
};

function ConversationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = async () => {
    try {
      const [convRes, msgRes] = await Promise.all([
        getConversation(id),
        getMessages(id)
      ]);
      setConversation(convRes.data);
      setMessages(msgRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !conversation || sending) return;

    setSending(true);
    try {
      await sendMessage(id, conversation.contact_wa_id, inputText);
      setInputText('');
      loadData();
    } catch (err) {
      alert('Erro ao enviar: ' + (err.response?.data?.error || err.message));
    } finally {
      setSending(false);
    }
  };

  if (!conversation) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full text-gray-500 md:hidden">
            <ChevronLeft size={20} />
          </button>
          <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
            {(conversation.profile_name || 'U').charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{conversation.profile_name || 'Usuário'}</h3>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Online (Janela 24h ativa)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><Phone size={20} /></button>
          <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><Video size={20} /></button>
          <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-100">
            Criptografia de Ponta a Ponta
          </span>
        </div>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-50">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Paperclip size={22} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-gray-50 border-none focus:ring-2 focus:ring-green-500 rounded-xl px-4 py-3 text-sm transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className={`p-3 rounded-xl shadow-lg transition-all ${
              !inputText.trim() || sending 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 shadow-green-100'
            }`}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConversationView;
