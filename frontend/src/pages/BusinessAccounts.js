import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2 } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function BusinessAccounts() {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/businesses`)
      .then(res => setBusinesses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Contas Business</h1>
      <p className="text-gray-500">Gerencie as contas WhatsApp Business conectadas</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {businesses.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{b.profile_name || 'Negócio'}</h3>
              <div className="flex gap-2">
                <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                  <Edit size={18} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">WABA:</span> {b.waba_id}</p>
              <p><span className="font-medium">Número:</span> {b.phone_number_id || 'Não informado'}</p>
              <p><span className="font-medium">Qualidade:</span> <span className="text-green-600 font-medium">GREEN</span></p>
              <p className="text-gray-400 text-xs">Criado em {new Date(b.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {businesses.length === 0 && (
          <p className="col-span-full text-center text-gray-400">Nenhuma conta conectada.</p>
        )}
      </div>
    </div>
  );
}

export default BusinessAccounts;