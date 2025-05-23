import { useMutation } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';

export const logout = async (data: any) => {
  const token = localStorage.getItem('res_token');

  try {
    const response = await client.post(
      '/restaurant/auth/logout',
      {},
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
      console.log('new token', newToken);

      if (newToken) {
        setHeaderToken(newToken);
        const retryResponse = await client.post(
          '/restaurant/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
        return retryResponse.data;
      } else {
        localStorage.removeItem('res_token');
        // toast.error('something went wrong');
        redirect('/login');
      }
    } else {
      throw error;
    }
  }
};
export function useLogout() {
  const mutation = useMutation({
    mutationFn: logout
  });

  return mutation;
}
