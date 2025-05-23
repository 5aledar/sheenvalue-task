import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

interface RestaurantData {
  country_id: string;
  city_id: string;
  area_id: string;
  address_en: string;
  address_ar: string;
  address_tr: string;
  name_en: string;
  name_ar: string;
  name_tr: string;
  email: string;
  phone: string;
  logo?: string;
  latitude: string;
  longitude: string;
  facebook_url?: string;
  instagram_url?: string;
  contact_number: string;
  is_available: boolean;
  start_time: string;
  end_time: string;
}

const updateRestaurant = async ({
  id,
  data
}: {
  id: number;
  data: RestaurantData;
}) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.put(`/restaurant/restaurants/${id}`, data, {
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
        const retryResponse = await client.put(
          `/restaurant/restaurants/${id}`,
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
        toast.error('Session expired. Please login again.');
        redirect('/login');
      }
    } else if (error.response?.status === 422) {
      const errorMessages = Object.values(error.response.data.errors)
        .flat()
        .join('\n');
      toast.error(`Validation failed:\n${errorMessages}`);
      throw new Error('Validation failed');
    } else {
      toast.error(error.response?.data?.message || 'Something went wrong');
      throw error;
    }
  }
};

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success('Restaurant updated successfully');
    },
    onError: () => {
      // Error handling is already done in the mutationFn
    }
  });
}
