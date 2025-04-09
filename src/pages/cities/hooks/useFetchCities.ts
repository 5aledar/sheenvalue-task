import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

export const fetchCities = async (page: number) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.get(
      `/admin/cities?page=${page}&include=country`,
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

      if (newToken) {
        setHeaderToken(newToken);
        const retryResponse = await client.get(
          '/admin/cities?include=country',
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
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
export function useFetchCities(page: number) {
  const { data, isLoading } = useQuery({
    queryKey: ['cities', page],
    queryFn: () => fetchCities(page)
  });

  return {
    cities: data?.data?.items,
    pagination: data?.data?.pagination,
    isLoading
  };
}
