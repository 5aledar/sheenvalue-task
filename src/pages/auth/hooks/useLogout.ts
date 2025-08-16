import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export const logout = async (data: any) => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.post(
      'https://reqres.in/api/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-api-key': 'reqres-free-v1'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    toast.error('error', error);
  }
};
export function useLogout() {
  const mutation = useMutation({
    mutationFn: logout
  });

  return mutation;
}
