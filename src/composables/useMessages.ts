import { useToast } from 'primevue/usetoast';
import type { ApiErrorInfo } from '@/types/errors';

export interface MessageOptions {
  title?: string;
  message?: string;
  life?: number;
}

export const useMessages = () => {
  const toast = useToast();

  const showSuccess = (options: MessageOptions = {}) => {
    const { title = 'Success', message = '', life = 3000 } = options;

    toast.add({
      severity: 'success',
      summary: title,
      detail: message,
      life,
    });
  };

  const showError = (options: MessageOptions = {}) => {
    const { title = 'Error', message = '', life = 5000 } = options;

    toast.add({
      severity: 'error',
      summary: title,
      detail: message,
      life,
    });
  };

  const showWarning = (options: MessageOptions = {}) => {
    const { title = 'Warning', message = '', life = 4000 } = options;

    toast.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life,
    });
  };

  const showInfo = (options: MessageOptions = {}) => {
    const { title = 'Info', message = '', life = 3000 } = options;

    toast.add({
      severity: 'info',
      summary: title,
      detail: message,
      life,
    });
  };

  const extractErrorMessage = (error: ApiErrorInfo | string | Error): string => {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return error.message || 'Unknown error occurred';
  };

  const showApiError = (error: ApiErrorInfo | string | Error, options: MessageOptions = {}) => {
    showError({
      title: options.title || 'API Error',
      message: extractErrorMessage(error),
      life: options.life || 5000,
    });
  };

  const clear = () => {
    toast.removeAllGroups();
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showApiError,
    clear,
  };
};
