import { useQuery } from '@tanstack/react-query';
import { client } from '../../../lib/axiosClient';

export const fetchProduct = async (id: string) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.get(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error;
  }
};

export function useFetchProduct(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id)
  });

  return {
    data,
    isLoading
  };
}
