import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../../../lib/axiosClient';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast';

// export const createCountry = async (data: any) => {
//   const token = localStorage.getItem('token');
//   try {
//     console.log({ name: data.name, currency: data.currency, code: data.code });
//     const response = await client.post(
//       '/admin/countries',
//       { data },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );
//     return response.data;
//   } catch (error: any) {

//     if (error.response?.status === 401) {
//       const newToken = await refreshAuth();
//       console.log('new token', newToken);

//       if (newToken) {
//         setHeaderToken(newToken);
//         const retryResponse = await client.post(
//           '/admin/countries',
//           { name: data.name, currency: data.currency, code: data.code },
//           {
//             headers: {
//               Authorization: `Bearer ${newToken}`
//             }
//           }
//         );
//         return retryResponse.data;
//       } else {
//         console.log('Redirecting to login...');
//         redirect('/login');
//       }
//     } else {
//       throw error;
//     }
//   }
// };

export const createCountry = async (data: any) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.post('/admin/countries', data, {
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
        const retryResponse = await client.post('/admin/countries', data, {
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
export function useCreateCountry() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    }
  });

  return mutation;
}
