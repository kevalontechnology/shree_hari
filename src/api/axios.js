import axios from 'axios';

const api = axios.create({
  // Hardcoded to ensure it works immediately on Render without env var configuration issues
   baseURL: 'http://localhost:5000/api',
  //baseURL: 'https://shree-hari-backend-9ww2.onrender.com/api',
  // baseURL: 'https://shree-hari-bakendx.onrender.com/api'
});

export default api;