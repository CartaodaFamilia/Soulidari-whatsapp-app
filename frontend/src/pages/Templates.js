import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import api from '../services/api';


const statusStyles = {
  approved: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: CheckCircle2,
    label: 'Aprovado',
  },
  pending: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: Clock,
    label: 'Pendente',
  },
  rejected: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: AlertCircle,
    label: 'Rejeitado',
  },
};

const TemplateCard = ({ name, display_name, category, status, language, header, body, footer }) => {
  const style = statusStyles[status] || statusStyles.pending;
  const StatusIcon = style.icon;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-green-600 transition-colors">
          <FileText size={20} />
        </div>
        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${style.bg} ${style.text}`}
        >
          <StatusIcon size={14} />
          {style.label}
        </span>
      </div>
      <h3 className="font-bold text-gray-900 mb-1 truncate">{display_name || name}</h3>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{category || 'Sem categoria'}</span>
        <span>•</span>
        <span>{language}</span>
      </div>
      {body && (
        <p className="text-xs text-gray-400 mt-2 line-clamp-2">
          {header ? `${header}\n` : ''}{body}{footer ? `\n${footer}` : ''}
        </p>
      )}
    </div>
  );
};

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const [form, setForm] = useState({
    name: '',
    display_name: '',
    categoria: 'Utility',
    linguagem: 'pt_BR',
    cabecalho: '',
    corpo: '',
    rodape: '',
  });

  const fetchTemplates = async () => {
    try {
      const res = await api.get('/templates');
      setTemplates(res.data);
    } catch (err) {
      console.error('Erro ao buscar templates', err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filtered = search
    ? templates.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.display_name && t.display_name.toLowerCase().includes(search.toLowerCase()))
      )
    : templates;

  const gerarPreview = () => {
    let texto = form.corpo.replace('{{1}}', 'NomeCliente').replace('{{2}}', '123');
    if (form.cabecalho) {
      texto = form.cabecalho + '\n' + texto;
    }
    if (form.rodape) {
      texto += '\n' + form.rodape;
    }
    setPreview(texto);
  };

  useEffect(() => {
    gerarPreview();
  }, [form.cabecalho, form.corpo, form.rodape]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.corpo.trim()) {
      return;
    }

    setLoading(true);
    try {
      await api.post('/templates', {
        name: form.name,
        display_name: form.display_name,
        categoria: form.categoria,
        linguagem: form.linguagem,
        cabecalho: form.cabecalho,
        corpo: form.corpo,
        rodape: form.rodape,
      });

      setShowModal(false);
      setForm({
        name: '',
        display_name: '',
        categoria: 'Utility',
        linguagem: 'pt_BR',
        cabecalho: '',
        corpo: '',
        rodape: '',
      });
      fetchTemplates();
    } catch (err) {
      alert('Erro ao criar template: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates de Mensagem</h1>
          <p className="text-gray-500">Gerencie seus modelos de mensagem aprovados pela Meta.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-xl text-sm font-medium text-white hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
        >
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((t) => (
          <TemplateCard
            key={t.id}
            name={t.name}
            display_name={t.display_name}
            category={t.category}
            status={t.status}
            language={t.language}
            header={t.header}
            body={t.body}
            footer={t.footer}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">
            Nenhum template encontrado.
          </div>
        )}
      </div>

     {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-xl max-h-[90vh] overflow-y-auto">
      <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X size={20} />
      </button>
      <h2 className="text-lg font-bold mb-5">Novo Template</h2>
      <form onSubmit={handleCreate} className="space-y-4">

        {/* Linha 1: Nome slug + Nome Exibição + Preview */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nome (slug) *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border border-green-400 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="meu_template"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nome Exibição</label>
            <input
              type="text"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Preview</label>
            <div className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 min-h-[36px] text-gray-500 text-xs whitespace-pre-wrap line-clamp-1">
              {preview || ''}
            </div>
          </div>
        </div>

        {/* Linha 2: Categoria + Idioma */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Categoria *</label>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Utility">Utilidade</option>
              <option value="Marketing">Marketing</option>
              <option value="Authentication">Autenticação</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Idioma</label>
            <select
              value={form.linguagem}
              onChange={(e) => setForm({ ...form, linguagem: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="pt_BR">Português (BR)</option>
              <option value="en_US">English (US)</option>
              <option value="es_ES">Español (ES)</option>
            </select>
          </div>
        </div>

        {/* Cabeçalho */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Cabeçalho</label>
          <select
            value={form.cabecalho}
            onChange={(e) => setForm({ ...form, cabecalho: e.target.value })}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Nenhum</option>
            <option value="TEXT">Texto</option>
            <option value="IMAGE">Imagem</option>
            <option value="VIDEO">Vídeo</option>
            <option value="DOCUMENT">Documento</option>
          </select>
        </div>

        {/* Corpo */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Corpo da Mensagem *</label>
          <textarea
            value={form.corpo}
            onChange={(e) => setForm({ ...form, corpo: e.target.value })}
            rows={4}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
            placeholder="Use {{1}}, {{2}} para variáveis"
            required
          />
        </div>

        {/* Rodapé */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Rodapé</label>
          <input
            type="text"
            value={form.rodape}
            onChange={(e) => setForm({ ...form, rodape: e.target.value })}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Criar Template'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default Templates;