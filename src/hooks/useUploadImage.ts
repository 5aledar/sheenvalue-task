import { useMutation } from '@tanstack/react-query';
import { client, setHeaderToken, refreshAuth } from '../lib/axiosClient';
import { redirect } from 'react-router-dom';

const uploadeImage = async (formData: FormData) => {
  const token = localStorage.getItem('token');

  try {
    const response = await client.post(`/restaurant/uploader/image`, formData, {
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
        const retryResponse = await client.post(
          `/restaurant/uploader/image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
        return retryResponse.data;
      } else {
        localStorage.removeItem('token');
        // toast.error('something went wrong');
        redirect('/login');
      }
    } else {
      throw error;
    }
  }
};

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadeImage
  });
}
