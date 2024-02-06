import axios from 'axios';

export const api = axios.create({
    baseURL: "https://backend-foodexplorer-api-6tji.onrender.com"
});

/* Use "http://localhost:3333" para acessar o database local */
/* Use "https://backend-foodexplorer-api-6tji.onrender.com" para acessar o database online */
