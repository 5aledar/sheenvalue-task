import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';

export const fetchCountries = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.get('/admin/countries', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);

    return response.data;
  } catch (error: any) {
    console.log('error', error);

    if (error.response?.status === 401) {
      const newToken = await refreshAuth();
      console.log('new token', newToken);

      if (newToken) {
        setHeaderToken(newToken);
        const retryResponse = await client.get('/admin/countries', {
          headers: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return retryResponse.data;
      } else {
        console.log('Redirecting to login...');
        redirect('/login');
      }
    } else {
      throw error;
    }
  }
};
export function useFetchCountries() {
  const { data, isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries
  });

  return {
    data,
    isLoading
  };
}
