import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

const deleteDriver = async (id: number) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.delete(`/admin/drivers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      const newToken = await refreshAuth();
      if (newToken) {
        setHeaderToken(newToken);
        const retryResponse = await client.delete(`/admin/drivers/${id}`, {
          headers: {
            Authorization: `Bearer ${newToken}`
          }
        });
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

export function useDeleteDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    }
  });
}
