import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Settings,
  UserCheck,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Users,
  Building2,
  Send,
  Contact
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [conversasOpen, setConversasOpen] = useState(true);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    {
      type: 'group',
      label: 'Conversas',
      icon: MessageSquare,
      children: [
        { path: '/conversations', icon: MessageSquare, label: 'Conversas' },
        { path: '/contacts', icon: Contact, label: 'Contatos' },
      ],
    },
    { path: '/templates', icon: FileText, label: 'Templates' },
    { path: '/opt-in', icon: UserCheck, label: 'Gestão de Opt-in' },
    { path: '/embedded-signup', icon: ExternalLink, label: 'Embedded Signup' },
    { path: '/business-accounts', icon: Building2, label: 'Contas Business' },
    { path: '/bulk-messaging', icon: Send, label: 'Disparos em Massa' },
    { path: '/settings', icon: Settings, label: 'Configurações' },
    { path: '/privacy', icon: ShieldCheck, label: 'Privacidade' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
            <MessageSquare size={24} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Soulidari
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {menuItems.map((item, idx) => {
            if (item.type === 'group') {
              return (
                <div key={idx}>
                  <button
                    onClick={() => setConversasOpen(!conversasOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {conversasOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {conversasOpen && (
                    <div className="ml-6 space-y-1 mt-1">
                      {item.children.map((child) => {
                        const Icon = child.icon;
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                              isActive(child.path)
                                ? 'bg-green-50 text-green-700 font-semibold'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                            }`}
                          >
                            <Icon size={18} />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.path)
                    ? 'bg-green-50 text-green-700 font-semibold'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-4 text-white shadow-lg">
            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Status da API</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold">Conectado à Meta</p>
            </div>
          </div>
        </div>
      </aside>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
            <MessageSquare size={18} />
          </div>
          <span className="font-bold text-lg">Soulidari</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white p-6 pt-20" onClick={e => e.stopPropagation()}>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                      isActive(item.path) ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

     {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 md:pt-0">
        <header className="hidden md:flex h-16 items-center justify-between px-8 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {menuItems
              .flatMap(i => (i.children ? i.children : i))
              .find(i => isActive(i.path))?.label || 'Soulidari App'}
          </h2>
          <div className="flex items-center gap-4">
  <div className="flex flex-col items-end">
    <span className="text-sm font-medium text-gray-900">Tech Provider Admin</span>
    <span className="text-xs text-gray-500">ID: 129384756</span>
  </div>
  <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
    <img src="https://ui-avatars.com/api/?name=Admin&background=059669&color=fff" alt="Avatar" />
  </div>
  <button
    onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}
    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
    title="Sair"
  >
    <LogOut size={20} />
  </button>
</div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
           {children || <Outlet />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
