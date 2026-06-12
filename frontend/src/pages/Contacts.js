import React, { useState, useEffect } from 'react';
import { Search, Trash2 } from 'lucide-react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/contacts`)
      .then(res => setContacts(res.data))
      .catch(err => console.error('Erro ao buscar contatos', err));
  }, []);

  const handleDelete = (id) => {
    // Implementar se desejar
    alert('Funcionalidade de exclusão em desenvolvimento.');
  };

  const filtered = search
    ? contacts.filter(c =>
        c.wa_id.includes(search) ||
        (c.profile_name || '').toLowerCase().includes(search.toLowerCase())
      )
    : contacts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar contatos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Nome</th>
              <th className="px-6 py-4 font-semibold">Telefone</th>
              <th className="px-6 py-4 font-semibold">WhatsApp ID</th>
              <th className="px-6 py-4 font-semibold">Opt-in</th>
              <th className="px-6 py-4 font-semibold">Criado em</th>
              <th className="px-6 py-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(contact => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{contact.profile_name || '―'}</td>
                <td className="px-6 py-4 text-gray-600">📞 {contact.wa_id}</td>
                <td className="px-6 py-4 text-gray-500">{contact.wa_id}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    contact.opt_in ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {contact.opt_in ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{new Date(contact.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(contact.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Nenhum contato encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-400">{contacts.length} contatos</p>
    </div>
  );
}

export default Contacts;