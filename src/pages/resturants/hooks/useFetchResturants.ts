import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

export const fetchResturants = async (page: number) => {
  const token = localStorage.getItem('res_token');

  try {
    const response = await client.get(`/restaurant/restaurants?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    console.log('error', error);

    if (error.response?.status === 401) {
      const newToken = await refreshAuth();

      if (newToken) {
        setHeaderToken(newToken);
        const retryResponse = await client.get(
          `/restaurant/restaurants?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
        return retryResponse.data;
      } else {
        localStorage.removeItem('res_token');
        // toast.error('something went wrong');
        redirect('/login');
      }
    } else {
      throw error;
    }
  }
};
export function useFetchResturants(page: number) {
  const { data, isLoading } = useQuery({
    queryKey: ['resturants', page],
    queryFn: () => fetchResturants(page)
  });

  return {
    resturants: data?.data?.items,
    pagination: data?.data?.pagination,
    isLoading
  };
}
