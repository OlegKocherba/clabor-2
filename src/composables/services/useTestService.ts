import { createApiClient } from '@/services/baseApiService';
import { useLoading } from '@/composables/useLoading';

interface TestResponse {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface CreateTestData {
  title: string;
  body: string;
  userId: number;
}

export const useTestService = () => {
  const { loading, error, withLoading } = useLoading();
  const api = createApiClient({ withLoading });

  const getPostReq = (id: number) => api.get<TestResponse>(`posts/${id}`);

  const getPostsReq = () => api.get<TestResponse[]>('posts');

  const createPostReq = (data: CreateTestData) => api.post<TestResponse>('posts', data);

  const updatePostReq = (id: number, data: Partial<CreateTestData>) =>
    api.put<TestResponse>(`posts/${id}`, data);

  const deletePostReq = (id: number) => api.delete<void>(`posts/${id}`);

  return { loading, error, getPostReq, getPostsReq, createPostReq, updatePostReq, deletePostReq };
};
