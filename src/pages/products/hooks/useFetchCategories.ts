import { useQuery } from '@tanstack/react-query';
import { client } from '../../../lib/axiosClient';

export const fetchCategories = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.get(`/products/category-list`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);

    return response.data;
  } catch (error: any) {
    console.log('error', error);
    throw error;
  }
};

export function useFetchCategories() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
    staleTime: 1000 * 60 * 5
  });

  return {
    data: data,

    isLoading
  };
}
