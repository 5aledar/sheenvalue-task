import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const login = async (data) => {
  const response = await axios.post(
    'https://dispatcher.mouhannadabdalrhem.online/api/v1/admin/auth/login',
    data
  );
  console.log(response);

  return response.data;
};

export function useLogin() {
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.data.token);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });

  return mutation;
}
