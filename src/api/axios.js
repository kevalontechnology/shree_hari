import axios from 'axios';

const api = axios.create({
  // Hardcoded to ensure it works immediately on Render without env var configuration issues
  // baseURL: 'https://shree-hari-backend-9ww2.onrender.com/api',
  baseurl: 'https://shree-hari-backend-9ww2.onrender.com'
});

export default api;