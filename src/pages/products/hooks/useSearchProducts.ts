import { client } from '@/lib/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../lib/types';

interface SearchProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const searchProducts = async (
  query: string
): Promise<SearchProductsResponse> => {
  if (!query) return { products: [], total: 0, skip: 0, limit: 0 };
  const response = await client.get<SearchProductsResponse>(
    `/products/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['searchProducts', query],
    queryFn: () => searchProducts(query),
    enabled: !!query,
    staleTime: 1000 * 60 * 5
  });
};
