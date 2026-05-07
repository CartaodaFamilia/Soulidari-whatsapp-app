import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getConversations } from '../services/api';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </div>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

function Dashboard() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversations()
      .then((res) => {
        setConversations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao Dashboard</h1>
          <p className="text-gray-500">Acompanhe o desempenho da sua API WhatsApp em tempo real.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Exportar Relatório
          </button>
          <button className="px-4 py-2 bg-green-600 rounded-xl text-sm font-medium text-white hover:bg-green-700 shadow-lg shadow-green-200 transition-all">
            Nova Campanha
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Conversas" 
          value={conversations.length} 
          icon={MessageCircle} 
          trend="up" 
          trendValue="12%" 
          color="bg-blue-500"
        />
        <StatCard 
          title="Mensagens Enviadas" 
          value="1,284" 
          icon={TrendingUp} 
          trend="up" 
          trendValue="8.4%" 
          color="bg-green-500"
        />
        <StatCard 
          title="Taxa de Entrega" 
          value="98.2%" 
          icon={CheckCircle2} 
          trend="up" 
          trendValue="0.5%" 
          color="bg-purple-500"
        />
        <StatCard 
          title="Tempo de Resposta" 
          value="4m 12s" 
          icon={Clock} 
          trend="down" 
          trendValue="2.1%" 
          color="bg-orange-500"
        />
      </div>

      {/* Recent Conversations Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Conversas Recentes</h2>
          <button className="text-sm font-medium text-green-600 hover:text-green-700">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Contato</th>
                <th className="px-6 py-4 font-semibold">Última Mensagem</th>
                <th className="px-6 py-4 font-semibold">Data/Hora</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">Carregando conversas...</td>
                </tr>
              ) : conversations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">Nenhuma conversa encontrada.</td>
                </tr>
              ) : (
                conversations.map((conv) => (
                  <tr key={conv.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xs">
                          {(conv.profile_name || 'U').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{conv.profile_name || 'Usuário Desconhecido'}</p>
                          <p className="text-xs text-gray-500">{conv.contact_wa_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 truncate max-w-xs">{conv.last_message || 'Sem mensagens'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {conv.last_message_at ? new Date(conv.last_message_at).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">Ativa</span>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`/conversation/${conv.id}`} className="text-green-600 hover:text-green-700 font-medium text-sm">Abrir Chat</a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

