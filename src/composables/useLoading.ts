import { reactive, readonly } from 'vue';

export const useLoading = () => {
  const loadingStates = reactive<Record<string, boolean>>({});
  const errors = reactive<Record<string, string | null>>({});

  const withLoading = async <T>(key: string, apiCall: () => Promise<T>): Promise<T | undefined> => {
    loadingStates[key] = true;
    errors[key] = null;

    try {
      return await apiCall();
    } catch (error) {
      errors[key] = error instanceof Error ? error.message : 'Unknown error';
      return undefined;
    } finally {
      loadingStates[key] = false;
    }
  };

  return {
    loading: readonly(loadingStates),
    error: readonly(errors),
    withLoading,
  };
};
