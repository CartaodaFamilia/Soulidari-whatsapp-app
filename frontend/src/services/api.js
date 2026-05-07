import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

export const getConversations = () => api.get('/api/conversations');
export const getConversation = (id) => api.get(`/api/conversations/${id}`);
export const getMessages = (conversationId) => api.get(`/api/messages/conversation/${conversationId}`);
export const sendMessage = (conversationId, to, text) =>
  api.post('/api/messages/send', { conversation_id: conversationId, to, text });

export default api;
