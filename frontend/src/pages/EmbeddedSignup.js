import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import axios from 'axios';

function EmbeddedSignup() {
  const META_APP_ID = '957751667117405';
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    // Carrega SDK do Facebook
    if (!window.FB) {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId      : META_APP_ID,
          cookie     : true,
          xfbml      : true,
          version    : 'v19.0'
        });
      };
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/businesses`);
      setBusinesses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const launchWhatsAppSignup = () => {
    if (!window.FB) {
      alert('SDK ainda carregando...');
      return;
    }
    window.FB.login((response) => {
      if (response.authResponse) {
        const code = response.authResponse.code;
        handleExchangeCode(code);
      }
    }, {
      config_id: '1644207190189168',
      response_type: 'code',
      override_default_response_type: true,
      scope: 'whatsapp_business_management,whatsapp_business_messaging',
      extras: { feature: 'whatsapp_embedded_signup' }
    });
  };

  const handleExchangeCode = async (code) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/whatsapp-exchange`, { code });
      if (res.data.success) {
        alert('Cliente conectado com sucesso!');
        fetchBusinesses();
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão: ' + (err.response?.data?.error || err.message));
    }
  };

  const renderIcon = (name, size = 20, className = "") => {
    const IconComponent = Icons[name];
    return IconComponent ? <IconComponent size={size} className={className} /> : null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-2xl mb-2">
          {renderIcon('Zap', 32, "fill-current")}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Conecte novos clientes</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Como Tech Provider, você pode integrar contas do WhatsApp Business de terceiros diretamente através do fluxo oficial da Meta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-900">O que é o Embedded Signup?</h3>
          <ul className="space-y-4">
            {['Integração rápida em menos de 5 minutos','O cliente mantém a propriedade da conta','Aprovação automática de WABA','Compartilhamento seguro de permissões'].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <div className="mt-1 p-0.5 bg-green-100 text-green-600 rounded-full">
                  {renderIcon('ShieldCheck', 14)}
                </div>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
          <button onClick={launchWhatsAppSignup}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all">
            {renderIcon('ExternalLink', 20)}
            Iniciar Fluxo da Meta
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl text-white space-y-6">
          <div className="flex items-center gap-2 text-blue-400">
            {renderIcon('Info', 20)}
            <span className="text-xs font-bold uppercase tracking-widest">Requisitos</span>
          </div>
          <h3 className="text-xl font-bold">Antes de começar</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Certifique-se de que o cliente tenha acesso de administrador ao Gerenciador de Negócios da Meta e um número de telefone válido que não esteja em uso no WhatsApp pessoal ou Business App.
          </p>
        </div>
      </div>

      {/* Clientes conectados */}
      {businesses.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Clientes Conectados</h3>
          <div className="space-y-3">
            {businesses.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">{b.profile_name || 'Sem nome'}</p>
                  <p className="text-xs text-gray-500">WABA: {b.waba_id}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">Conectado</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmbeddedSignup;