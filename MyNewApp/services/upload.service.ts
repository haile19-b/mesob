import { apiClient } from '../api/client';

export const uploadService = {
  uploadImage: async (uri: string): Promise<string> => {
    const filename = uri.split('/').pop() || `image-${Date.now()}.jpg`;
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    const formData = new FormData();
    formData.append('image', {
      uri,
      name: filename,
      type: mime,
    } as any);

    const response = await apiClient.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.imageUrl as string;
  },
};
