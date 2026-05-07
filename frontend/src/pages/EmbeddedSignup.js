import React from 'react';
import { ExternalLink, Info, ShieldCheck, Zap } from 'lucide-react';

function EmbeddedSignup() {
  const launchWhatsAppSignup = () => {
    // Lógica para abrir o popup da Meta
    console.log('Iniciando Embedded Signup...');
    alert('Aqui seria aberto o popup oficial da Meta para o cliente conectar o WhatsApp Business dele ao seu Tech Provider.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-2xl mb-2">
          <Zap size={32} fill="currentColor" />
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
            {[
              'Integração rápida em menos de 5 minutos',
              'O cliente mantém a propriedade da conta',
              'Aprovação automática de WABA',
              'Compartilhamento seguro de permissões'
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <div className="mt-1 p-0.5 bg-green-100 text-green-600 rounded-full">
                  <ShieldCheck size={14} />
                </div>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={launchWhatsAppSignup}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all"
          >
            <ExternalLink size={20} />
            Iniciar Fluxo da Meta
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl text-white space-y-6">
          <div className="flex items-center gap-2 text-blue-400">
            <Info size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Requisitos</span>
          </div>
          <h3 className="text-xl font-bold">Antes de começar</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Certifique-se de que o cliente tenha acesso de administrador ao Gerenciador de Negócios da Meta e um número de telefone válido que não esteja em uso no WhatsApp pessoal ou Business App.
          </p>
          <div className="pt-4 border-t border-gray-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Status do App</span>
              <span className="text-green-400 font-medium">Pronto para Produção</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
        <p className="text-sm text-yellow-800 leading-relaxed">
          <strong>Nota de Homologação:</strong> Esta tela é obrigatória para a revisão do App da Meta. 
          O botão acima deve disparar o SDK de JavaScript da Meta (fbsdk.js) configurado com seu <code>app_id</code> e <code>config_id</code>.
        </p>
      </div>
    </div>
  );
}

export default EmbeddedSignup;
