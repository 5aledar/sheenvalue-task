import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

export const fetchCountries = async (page?: number) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.get(`/admin/countries?page=${page || 1}`, {
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
        localStorage.removeItem('token');
        toast.error('something went wrong');
        redirect('/login');
      }
    } else {
      throw error;
    }
  }
};
export function useFetchCountries(page: number) {
  const { data, isLoading } = useQuery({
    queryKey: ['countries', page],
    queryFn: () => fetchCountries(page)
  });

  return {
    countries: data?.data?.items,
    pagination: data?.data?.pagination,
    isLoading
  };
}
