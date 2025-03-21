import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';

export const fetchDrivers = async (page: number) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.get(
      `/admin/drivers?page=${page}&include=country,city,area`,
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
        const retryResponse = await client.get(
          '/admin/drivers?include=country,city,area',
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
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

export function useFetchDrivers(page: number) {
  const { data, isLoading } = useQuery({
    queryKey: ['drivers', page],
    queryFn: () => fetchDrivers(page)
  });

  return {
    drivers: data?.data?.items,
    pagination: data?.data?.pagination,
    isLoading
  };
}
