import React from 'react';
import { Plus, Search, Filter, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const TemplateCard = ({ name, category, status, language }) => {
  const statusStyles = {
    approved: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2, label: 'Aprovado' },
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: Clock, label: 'Pendente' },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle, label: 'Rejeitado' },
  };

  const style = statusStyles[status] || statusStyles.pending;
  const StatusIcon = style.icon;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-green-600 transition-colors">
          <FileText size={20} />
        </div>
        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${style.bg} ${style.text}`}>
          <StatusIcon size={14} />
          {style.label}
        </span>
      </div>
      <h3 className="font-bold text-gray-900 mb-1 truncate">{name}</h3>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{category}</span>
        <span>•</span>
        <span>{language}</span>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
        <button className="flex-1 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Editar</button>
        <button className="flex-1 py-2 text-xs font-semibold text-green-600 hover:bg-green-50 rounded-lg transition-colors">Enviar</button>
      </div>
    </div>
  );
};

function Templates() {
  const templates = [
    { name: 'boas_vindas_cliente', category: 'Marketing', status: 'approved', language: 'pt_BR' },
    { name: 'confirmacao_pedido', category: 'Utility', status: 'approved', language: 'pt_BR' },
    { name: 'lembrete_agendamento', category: 'Utility', status: 'pending', language: 'pt_BR' },
    { name: 'promocao_natal', category: 'Marketing', status: 'rejected', language: 'pt_BR' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates de Mensagem</h1>
          <p className="text-gray-500">Gerencie seus modelos de mensagem aprovados pela Meta.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-xl text-sm font-medium text-white hover:bg-green-700 shadow-lg shadow-green-200 transition-all">
          <Plus size={18} />
          Novo Template
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar templates..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((t, i) => (
          <TemplateCard key={i} {...t} />
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl h-fit">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900">Regras da Meta para Templates</h4>
          <p className="text-sm text-blue-800 mt-1">
            Lembre-se que todos os templates devem seguir as políticas comerciais do WhatsApp. 
            Templates de marketing exigem opt-in explícito do usuário. O tempo médio de aprovação é de 24h.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Templates;

