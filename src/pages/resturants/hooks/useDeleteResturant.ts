import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

const deleteResturant = async (id: number) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.delete(`/restaurant/restaurants/${id}`, {
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
        const retryResponse = await client.delete(
          `/restaurant/restaurants/${id}`,
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

export function useDeleteResturant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResturant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resturants'] });
    }
  });
}
