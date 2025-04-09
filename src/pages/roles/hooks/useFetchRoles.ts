import { useQuery } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

export const fetchRoles = async (page: number) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.get(
      `/admin/roles?page=${page}?include=permissions`,
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
          `/admin/roles?page=${page}&include=permissions`,
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
        return retryResponse.data;
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
export function useFetchRoles(page: number) {
  const { data, isLoading } = useQuery({
    queryKey: ['roles', page],
    queryFn: () => fetchRoles(page)
  });

  return {
    roles: data?.data?.items,
    pagination: data?.data?.pagination,
    isLoading
  };
}
