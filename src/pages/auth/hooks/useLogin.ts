import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const login = async (data: any) => {
  const response = await axios.post(
    'https://reqres.in/api/login',

    data,
    {
      headers: {
        // i should use it as an enviroment variable put i used it directly in the code just for the task
        'x-api-key': 'reqres-free-v1'
      }
    }
  );

  return response.data;
};

export function useLogin() {
  const mutation = useMutation({
    mutationFn: login,

    onError: (error) => {
      console.error('Login failed:', error);
    }
  });

  return mutation;
}
