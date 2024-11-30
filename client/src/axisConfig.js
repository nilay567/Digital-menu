import axios from 'axios';

axios.defaults.baseURL =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:5003' // Development API URL
    : 'https://digimenu-1.onrender.com'; 