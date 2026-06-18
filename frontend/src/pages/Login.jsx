import React, { useState } from 'react';
import axios from 'axios';

const API = '';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/app';
    } catch (err) {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold">S</div>
          <h1 className="text-xl font-bold">Soulidari</h1>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Entrar na plataforma</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
              required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full mt-1 p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
              required />
          </div>
          <button type="submit"
            className="w-full py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
