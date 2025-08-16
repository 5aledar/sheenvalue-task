import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../../../lib/axiosClient';

export const createProduct = async (data: any) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.post('/products/add', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.log('Validation Error:', error.response.data);
    throw new Error(
      'Validation failed: ' + JSON.stringify(error.response.data)
    );
  }
};
export function useCreateProduct() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  return mutation;
}
