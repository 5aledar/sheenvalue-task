import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';

export const fetchOrderDetails = async (
  restaurantId: string,
  orderId: string
) => {
  const token = localStorage.getItem('res_token');

  try {
    const response = await client.get(
      `/restaurant/${restaurantId}/orders/${orderId}`,
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
          `/restaurant/${restaurantId}/orders/${orderId}`,
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

export function useFetchOrderDetails(restaurantId: string, orderId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['order-details', restaurantId, orderId],
    queryFn: () => fetchOrderDetails(restaurantId, orderId),
    enabled: !!restaurantId && !!orderId
  });

  return {
    order: data?.data,
    isLoading
  };
}
