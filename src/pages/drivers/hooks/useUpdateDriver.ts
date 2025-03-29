import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

const updateDriver = async ({ id, data }: { id: number; data: FormData }) => {
  const token = localStorage.getItem('token');
  console.log('--- FormData Contents ---');
  for (const [key, value] of data.entries()) {
    console.log(key, value);
  }
  console.log('-------------------------');
  data.append('_method', 'PUT');
  try {
    const response = await client.post(`/admin/drivers/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response);

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      const newToken = await refreshAuth();
      if (newToken) {
        setHeaderToken(newToken);
        const retryResponse = await client.post(`/admin/drivers/${id}`, data, {
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

export function useUpdateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    }
  });
}
