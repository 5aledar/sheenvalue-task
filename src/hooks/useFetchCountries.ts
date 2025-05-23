import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../lib/axiosClient';
import { redirect } from 'react-router-dom';

export const fetchCountries = async () => {
  const token = localStorage.getItem('res_token');
  // console.log(token);

  try {
    const response = await client.get(`/restaurant/countries?isPaginated=0`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    console.log('error', error);

    if (error.response?.status === 401) {
      const newToken = await refreshAuth();

      if (newToken) {
        setHeaderToken(newToken);
        const retryResponse = await client.get(
          '/restaurant/countries?isPaginated=0',
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
        return retryResponse.data;
      } else {
        localStorage.removeItem('res_token');
        // toast.error('something went wrong');
        redirect('/login');
      }
    } else {
      throw error;
    }
  }
};
export function useFetchCountries() {
  const { data, isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: () => fetchCountries()
  });

  return {
    countries: data?.data,
    // pagination: data?.data?.pagination,
    isLoading
  };
}
