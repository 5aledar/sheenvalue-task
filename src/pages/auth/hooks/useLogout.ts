// import { useMutation } from '@tanstack/react-query';
// import axios from 'axios';

// const logout = async () => {
//   const token = localStorage.getItem('token');
//   const response = await axios.post(
//     'https://dispatcher.mouhannadabdalrhem.online/api/v1/admin/auth/logout',
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   return response.data;
// };
import { useMutation } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';

export const logout = async (data: any) => {
  const token = localStorage.getItem('token');

  try {
    console.log(data);
    const response = await client.post(
      '/admin/auth/logout',
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
        const retryResponse = await client.put(
          '/admin/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
        return retryResponse.data;
      } else {
        console.log('Redirecting to login...');
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
