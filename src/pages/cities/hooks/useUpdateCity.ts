import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

const updateCity = async ({
  id,
  data
}: {
  id: number;
  data: {
    name_en: string;
    name_ar: string;
    name_tr: string;
    country_id: string;
  };
}) => {
  const token = localStorage.getItem('token');
  console.log(data);

  try {
    const response = await client.put(`/admin/cities/${id}`, data, {
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
        const retryResponse = await client.put(`/admin/cities/${id}`, data, {
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

export function useUpdateCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    }
  });
}
