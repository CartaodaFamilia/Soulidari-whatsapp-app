import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const getConversations = () => api.get('/conversations');
export const getConversation = (id) => api.get(`/conversations/${id}`);
export const getMessages = (conversationId) => api.get(`/messages/conversation/${conversationId}`);
export const sendMessage = (conversationId, to, text) =>
  api.post('/messages/send', { conversation_id: conversationId, to, text });

export default api;
