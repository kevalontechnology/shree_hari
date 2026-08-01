import axios from 'axios';

const api = axios.create({
  // Hardcoded to ensure it works immediately on Render without env var configuration issues
  baseURL: 'http://localhost:5000/api',
  
});

export default api;