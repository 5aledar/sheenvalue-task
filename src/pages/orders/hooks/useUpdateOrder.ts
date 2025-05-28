import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import { OrderFormData } from '../lib/types';

export const updateOrder = async (
  restaurantId: string,
  orderId: string,
  data: OrderFormData
) => {
  const token = localStorage.getItem('res_token');

  try {
    const response = await client.put(
      `/restaurant/${restaurantId}/orders/${orderId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      const newToken = await refreshAuth();
      if (newToken) {
        setHeaderToken(newToken);
        const retryResponse = await client.put(
          `/restaurant/${restaurantId}/orders/${orderId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
              'Content-Type': 'application/json'
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

export function useUpdateOrder(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: OrderFormData }) =>
      updateOrder(restaurantId, orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', restaurantId] });
    }
  });
}
