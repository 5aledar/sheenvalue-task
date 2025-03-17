import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';

export const fetchAreas = async (page: number) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.get(
      `/admin/areas?page=${page}&include=city`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.log('error', error);

    if (error.response?.status === 401) {
      const newToken = await refreshAuth();
      console.log('new token', newToken);

      if (newToken) {
        setHeaderToken(newToken);
        const retryResponse = await client.get('/admin/areas?include=city', {
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
export function useFetchAreas(page: number) {
  const { data, isLoading } = useQuery({
    queryKey: ['areas', page],
    queryFn: () => fetchAreas(page)
  });

  return {
    areas: data?.data?.items,
    pagination: data?.data?.pagination,
    isLoading
  };
}
