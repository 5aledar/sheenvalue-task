import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

export const createDriver = async (data: FormData) => {
  const token = localStorage.getItem('token');

  try {
    console.log('ss');
    const response = await client.post('/admin/drivers', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      const newToken = await refreshAuth();
      if (newToken) {
        setHeaderToken(newToken);
        const retryResponse = await client.post('/admin/drivers', data, {
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

export function useCreateDriver() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    }
  });

  return mutation;
}
