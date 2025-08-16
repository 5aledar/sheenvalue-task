import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../../../lib/axiosClient';
import toast from 'react-hot-toast';

type ProductData = {
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
};

const updateProduct = async ({
  id,
  data
}: {
  id: number;
  data: ProductData;
}) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.put(`/products/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Something went wrong');
    throw error;
  }
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
}
