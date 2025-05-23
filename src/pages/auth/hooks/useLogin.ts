import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const login = async (data: any) => {
  const response = await axios.post(
    'https://dispatcher.mouhannadabdalrhem.online/api/v1/restaurant/auth/login',
    data
  );
  console.log(response.data);

  return response.data;
};

export function useLogin() {
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data);

      localStorage.setItem('res_token', data.data.token);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });

  return mutation;
}
