import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';

const deleteOrder = async (restaurantId: string, orderId: number) => {
  const token = localStorage.getItem('res_token');

  try {
    const response = await client.delete(
      `/restaurant/${restaurantId}/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      const newToken = await refreshAuth();
      if (newToken) {
        setHeaderToken(newToken);
        const retryResponse = await client.delete(
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

export function useDeleteOrder(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => deleteOrder(restaurantId, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', restaurantId] });
    }
  });
}
