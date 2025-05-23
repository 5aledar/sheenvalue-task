import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

export const fetchCities = async (coutryId: string) => {
  const token = localStorage.getItem('res_token');

  try {
    const response = await client.get(
      `restaurant/cities?isPaginated=0&filter[country_id]=${coutryId}`,
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
          `/restaurant/cities?isPaginated=0&filter[country_id]=${coutryId}`,
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
        return retryResponse.data;
      }
    } else {
      throw error;
    }
  }
};
export function useFetchCities(coutryId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['cities', coutryId],
    queryFn: () => fetchCities(coutryId)
  });

  return {
    cities: data?.data,
    pagination: data?.data?.pagination,
    isLoading
  };
}
