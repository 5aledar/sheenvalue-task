import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';

export const fetchRestaurantsForSelect = async () => {
  const token = localStorage.getItem('res_token');

  try {
    const response = await client.get(`/restaurant/restaurants?isPaginated=0`, {
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
          `/restaurant/restaurants?isPaginated=0`,
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
        return retryResponse.data;
      } else {
        localStorage.removeItem('res_token');
        redirect('/login');
      }
    } else {
      throw error;
    }
  }
};

export function useFetchRestaurantsForSelect() {
  const { data, isLoading } = useQuery({
    queryKey: ['restaurants-for-select'],
    queryFn: () => fetchRestaurantsForSelect()
  });

  return {
    restaurants: data?.data,
    isLoading
  };
}
