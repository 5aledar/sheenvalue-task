import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';

export const createResturant = async (data: any) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.post('/restaurant/restaurants', data, {
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
        const retryResponse = await client.post(
          '/restaurant/restaurants',
          data,
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
    } else if (error.response?.status === 422) {
      console.log('Validation Error:', error.response.data);
      throw new Error(
        'Validation failed: ' + JSON.stringify(error.response.data)
      );
    } else {
      throw error;
    }
  }
};
export function useCreateResturant() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createResturant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resturants'] });
    }
  });

  return mutation;
}
