import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';

export const fetchOrders = async (restaurantId: string, page: number) => {
  const token = localStorage.getItem('res_token');

  try {
    const response = await client.get(
      `/restaurant/${restaurantId}/orders?page=${page}`,
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
          `/restaurant/${restaurantId}/orders?page=${page}`,
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

export function useFetchOrders(restaurantId: string, page: number) {
  const { data, isLoading } = useQuery({
    queryKey: ['orders', restaurantId, page],
    queryFn: () => fetchOrders(restaurantId, page),
    enabled: !!restaurantId
  });

  return {
    orders: data?.data?.items,
    pagination: data?.data?.pagination,
    isLoading
  };
}
