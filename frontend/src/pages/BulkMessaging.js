import React, { useState, useRef } from 'react';
import { UploadCloud, Send, FileText } from 'lucide-react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function BulkMessaging() {
  const [campaignName, setCampaignName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateList, setTemplateList] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [recipientsCount, setRecipientsCount] = useState(0);
  const fileInputRef = useRef(null);

  // Carregar templates existentes para o dropdown
  React.useEffect(() => {
    axios.get(`${API}/api/templates`)
      .then(res => setTemplateList(res.data))
      .catch(console.error);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    if (file) {
      // Simples contagem de linhas (desconsiderando cabeçalho)
      const reader = new FileReader();
      reader.onload = (evt) => {
        const lines = evt.target.result.split('\n').filter(line => line.trim() !== '');
        setRecipientsCount(lines.length - 1 >= 0 ? lines.length - 1 : 0); // -1 para cabeçalho
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!campaignName || !selectedTemplate || !csvFile) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    // Aqui faríamos o envio para o backend processar o disparo
    alert(`Campanha "${campaignName}" com template ${selectedTemplate} será enviada para ${recipientsCount} contatos.`);
    // Resetar após envio? Opcional.
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Disparo em Massa</h1>
        <p className="text-gray-500">Envie mensagens para múltiplos contatos de uma vez</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-bold">Informações da Campanha</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Campanha *</label>
            <input
              type="text"
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-xl"
              placeholder="Ex: Promoção de Maio 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Template de Mensagem *</label>
            <select
              value={selectedTemplate}
              onChange={e => setSelectedTemplate(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-xl"
            >
              <option value="">Selecione um template</option>
              {templateList.map(t => (
                <option key={t.id} value={t.name}>{t.name} ({t.category})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold">Destinatários</h2>
        <div 
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-green-400 transition-colors"
          onClick={() => fileInputRef.current.click()}
        >
          <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-sm text-gray-500">Arraste um arquivo CSV ou clique para selecionar</p>
          <p className="text-xs text-gray-400 mt-1">Formato: telefone, nome (uma linha por contato)</p>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {csvFile && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText size={16} />
            <span>{csvFile.name}</span>
            <span className="text-gray-400">({recipientsCount} contatos)</span>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!campaignName || !selectedTemplate || !csvFile}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 shadow-lg shadow-green-100"
        >
          <Send size={20} />
          Disparar para {recipientsCount} contato(s)
        </button>
      </div>

      {/* Histórico de Campanhas (mock) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Histórico de Campanhas</h2>
        <p className="text-gray-400 text-center py-8">Nenhuma campanha enviada ainda.</p>
      </div>
    </div>
  );
}

export default BulkMessaging;