// src/axiosClient.ts
import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://dispatcher.mouhannadabdalrhem.online/api/v1'
});

export const setHeaderToken = (token: string) => {
  client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeHeaderToken = () => {
  delete client.defaults.headers.common['Authorization'];
};

export const refreshAuth = async () => {
  const token = localStorage.getItem('res_token');
  if (!token) return null;

  try {
    const response = await client.post(
      '/restaurant/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const newToken = response.data.data.token;

    localStorage.setItem('res_token', newToken);
    return newToken;
  } catch (error) {
    console.error('Token refresh failed', error);
    return null;
  }
};
