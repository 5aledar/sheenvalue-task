import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';

export const fetchPermissions = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.get(`restaurant/permissions?isPaginated=0`, {
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
          `restaurant/permissions?isPaginated=0`,
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
        return retryResponse.data;
      } else {
        localStorage.removeItem('token');
        // toast.error('something went wrong');
        redirect('/login');
      }
    } else {
      throw error;
    }
  }
};
export function useFetchPermissions() {
  const { data, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: fetchPermissions
  });

  return {
    permissions: data?.data,
    isLoading
  };
}
