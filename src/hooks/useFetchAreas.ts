import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../lib/axiosClient';
// import { redirect } from 'react-router-dom';
// import toast from 'react-hot-toast';

export const fetchAreas = async (cityId: string) => {
  const token = localStorage.getItem('res_token');

  try {
    const response = await client.get(
      `/restaurant/areas?isPaginated=0&filter[city_id]=${cityId}`,
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
          `restaurant/areas?isPaginated=0&filter[city_id]=${cityId}`,
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
export function useFetchAreas(cityId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['areas', cityId],
    queryFn: () => fetchAreas(cityId)
  });

  return {
    areas: data?.data,
    pagination: data?.data?.pagination,
    isLoading
  };
}
