import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, ShieldCheck, Download, Search } from 'lucide-react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function OptInManagement() {
  const [optIns, setOptIns] = useState([]);
  const [search, setSearch] = useState('');

  const fetchOptIns = async () => {
    try {
      const res = await axios.get(`${API}/api/opt-ins`);
      setOptIns(res.data);
    } catch (err) {
      console.error('Erro ao carregar opt-ins', err);
    }
  };

  useEffect(() => {
    fetchOptIns();
  }, []);

  const filtered = search.trim()
    ? optIns.filter(o => o.wa_id.includes(search) || (o.profile_name || '').toLowerCase().includes(search.toLowerCase()))
    : optIns;

  const active = optIns.filter(o => o.status === 'active').length;
  const revoked = optIns.filter(o => o.status === 'revoked').length;

  const exportCSV = () => {
    const header = 'ID,Nome,Telefone,Data,Origem,Status\n';
    const csv = optIns.map(o => `${o.id},"${o.profile_name || ''}",${o.wa_id},"${new Date(o.consent_date).toLocaleString()}","${o.source || ''}",${o.status}`).join('\n');
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opt_ins.csv';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Opt-in</h1>
          <p className="text-gray-500">Registro obrigatório de consentimento para envio de mensagens.</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Download size={18} />
          Exportar Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-green-700 mb-2">
            <UserCheck size={20} />
            <span className="font-bold">Opt-ins Ativos</span>
          </div>
          <p className="text-3xl font-bold text-green-900">{active}</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-red-700 mb-2">
            <UserX size={20} />
            <span className="font-bold">Revogados</span>
          </div>
          <p className="text-3xl font-bold text-red-900">{revoked}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-blue-700 mb-2">
            <ShieldCheck size={20} />
            <span className="font-bold">Conformidade</span>
          </div>
          <p className="text-3xl font-bold text-blue-900">100%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">Registros de Consentimento</h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar telefone..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Usuário</th>
                <th className="px-6 py-4 font-semibold">Telefone</th>
                <th className="px-6 py-4 font-semibold">Data do Opt-in</th>
                <th className="px-6 py-4 font-semibold">Origem</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.profile_name || '―'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.wa_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.consent_date).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.source || '―'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {item.status === 'active' ? 'Ativo' : 'Revogado'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Nenhum registro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OptInManagement;