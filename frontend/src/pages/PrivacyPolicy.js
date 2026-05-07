import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-br from-green-600 to-green-800 p-12 text-white text-center">
        <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
          <Shield size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
        <p className="opacity-80">Última atualização: 07 de Maio de 2026</p>
      </div>

      <div className="p-8 md:p-12 space-y-10">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-green-700">
            <Lock size={24} />
            <h2 className="text-xl font-bold">1. Coleta de Dados</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Como Tech Provider da Meta, o Soulidari App coleta e processa mensagens enviadas e recebidas através da API do WhatsApp Business apenas para fins de viabilizar a comunicação entre empresas e seus clientes finais. Os dados coletados incluem números de telefone, nomes de perfil e conteúdo das mensagens.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-green-700">
            <Eye size={24} />
            <h2 className="text-xl font-bold">2. Uso das Informações</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            As informações são utilizadas exclusivamente para:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Entrega de mensagens em tempo real via Webhooks.</li>
            <li>Geração de métricas de desempenho e relatórios de entrega.</li>
            <li>Manutenção do histórico de conversas para atendimento ao cliente.</li>
            <li>Garantia de conformidade com as políticas da Meta.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-green-700">
            <FileText size={24} />
            <h2 className="text-xl font-bold">3. Compartilhamento com a Meta</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Todos os dados processados estão sujeitos aos Termos de Serviço do WhatsApp Business e às Políticas de Dados da Meta. Não compartilhamos informações com terceiros para fins publicitários.
          </p>
        </section>

        <div className="pt-8 border-t border-gray-100">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="font-bold text-gray-900 mb-2">Dúvidas sobre seus dados?</h4>
            <p className="text-sm text-gray-500 mb-4">Entre em contato com nosso encarregado de proteção de dados (DPO).</p>
            <a href="mailto:privacy@soulidari.com" className="text-green-600 font-bold hover:underline">privacy@soulidari.com</a>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 p-6 text-center">
        <p className="text-xs text-gray-400">
          Esta política é pública e obrigatória para a aprovação do App Review da Meta.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
