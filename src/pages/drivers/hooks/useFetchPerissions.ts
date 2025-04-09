import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

export const fetchhPermissions = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.get(`/admin/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      const newToken = await refreshAuth();

      if (newToken) {
        try {
          setHeaderToken(newToken);
          const retryResponse = await client.get('/admin/profile', {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          });
          return retryResponse.data;
        } catch (error) {
          console.log(error);
        }
      } else {
        localStorage.removeItem('token');
        toast.error('something went wrong');
        redirect('/login');
      }
    } else {
      throw error;
    }
  }
};

export function useFetchProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['permissions'],
    queryFn: fetchhPermissions
  });

  return {
    permissions: data?.data?.items,
    error,
    isLoading
  };
}
