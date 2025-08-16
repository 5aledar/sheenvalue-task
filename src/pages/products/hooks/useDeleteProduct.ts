import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../../../lib/axiosClient';

const deleteProduct = async (id: number) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
}
