import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { client } from '@/lib/axiosClient';
import { Product } from '../lib/types';

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

const fetchProducts = async ({
  page,
  limit
}: {
  page: number;
  limit: number;
}): Promise<ProductsResponse> => {
  const skip = (page - 1) * limit;
  const { data } = await client.get<ProductsResponse>(
    `/products?limit=${limit}&skip=${skip}`
  );
  return data;
};

export const useFetchProducts = (page: number, limit = 10) => {
  const query = useQuery<ProductsResponse>({
    queryKey: ['products', page, limit],
    queryFn: () => fetchProducts({ page, limit }),
    placeholderData: keepPreviousData
  });

  return {
    products: query.data?.products ?? [],
    pagination: {
      total: query.data?.total ?? 0,
      skip: query.data?.skip ?? (page - 1) * limit,
      limit: query.data?.limit ?? limit,
      page,
      totalPages: Math.ceil((query.data?.total ?? 0) / limit)
    },
    isLoading: query.isLoading
  };
};
