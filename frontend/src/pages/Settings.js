import React, { useState, useEffect } from 'react';
import { Save, Key, Smartphone, Globe, Bell, Shield } from 'lucide-react';
import api from '../services/api';

const SettingSection = ({ title, description, icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-gray-50 flex items-center gap-4">
      <div className="p-2 bg-gray-50 text-gray-500 rounded-lg">{icon}</div>
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

const InputField = ({ label, name, type = "text", placeholder, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
    />
  </div>
);

function Settings() {
  const [config, setConfig] = useState({
    WABA_ID: '',
    PHONE_NUMBER_ID: '',
    ACCESS_TOKEN: '',
    VERIFY_TOKEN: '',
    WEBHOOK_URL: 'https://saudesoulidari.com.br/webhook',
    FRONTEND_URL: 'https://saudesoulidari.com.br'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Carregar configurações atuais
    api.get('/settings')
      .then(response => {
        setConfig(prev => ({ ...prev, ...response.data }));
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar configurações', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/settings', config);
      alert('Configurações salvas! O backend será reiniciado.');
      window.location.reload();
    } catch (err) {
      alert('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando configurações...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-500">Gerencie as credenciais da API e preferências do sistema.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 rounded-xl text-sm font-bold text-white hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
        >
          <Save size={18} />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SettingSection title="Credenciais da API Meta" description="Configure os tokens e IDs necessários para a comunicação com o WhatsApp." icon={<Key size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="WhatsApp Business Account ID" name="WABA_ID" value={config.WABA_ID} onChange={handleChange} placeholder="Ex: 1092837465" />
            <InputField label="Phone Number ID" name="PHONE_NUMBER_ID" value={config.PHONE_NUMBER_ID} onChange={handleChange} placeholder="Ex: 9876543210" />
          </div>
          <InputField label="Access Token (System User)" name="ACCESS_TOKEN" type="password" value={config.ACCESS_TOKEN} onChange={handleChange} placeholder="EAAB..." />
          <InputField label="Verify Token (Webhook)" name="VERIFY_TOKEN" value={config.VERIFY_TOKEN} onChange={handleChange} placeholder="Seu token de verificação personalizado" />
        </SettingSection>

        <SettingSection title="Webhook & Endpoints" description="URLs para recebimento de eventos em tempo real." icon={<Globe size={20} />}>
          <InputField label="Webhook URL" name="WEBHOOK_URL" value={config.WEBHOOK_URL} onChange={handleChange} placeholder="https://..." />
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Dica:</strong> Certifique-se de que seu servidor suporta HTTPS e responde com 200 OK para as validações da Meta.
            </p>
          </div>
        </SettingSection>

        <SettingSection title="Segurança & Privacidade" description="Configurações de proteção de dados e logs." icon={<Shield size={20} />}>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-bold text-gray-900">Mascarar dados sensíveis</p>
              <p className="text-xs text-gray-500">Ocultar números de telefone nos logs do sistema.</p>
            </div>
            <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </SettingSection>
      </div>
    </form>
  );
}

export default Settings;
