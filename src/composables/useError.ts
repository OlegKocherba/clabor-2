import { ref, inject, readonly } from 'vue';
import { useMessages } from './useMessages';
import { ErrorType } from '@/types/errors';
import type { AppError, ErrorHandlerOptions, ApiError } from '@/types/errors';

export const useError = () => {
  const { showError } = useMessages();
  const errors = ref<AppError[]>([]);

  // Inject error boundary context if available
  const errorBoundary = inject<{
    reportError: (error: Error, context?: Record<string, unknown>) => void;
    recover: () => void;
  } | null>('errorBoundary', null);

  const createError = (
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    context?: Record<string, unknown>,
  ): AppError => ({
    id: `error_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    type,
    message,
    timestamp: new Date(),
    context,
    recoverable: true,
  });

  const logError = (error: AppError) => {
    console.error(`${error.type}:`, {
      id: error.id,
      message: error.message,
      timestamp: error.timestamp,
      context: error.context,
      stack: error.stack,
    });

    errors.value.push(error);
  };

  const handleError = (error: Error | AppError, options: ErrorHandlerOptions = {}) => {
    const { showToast = true, logError: shouldLog = true, recoverable = true } = options;

    let appError: AppError;

    if (error instanceof Error) {
      appError = createError(error.message || 'An unexpected error occurred', ErrorType.SYSTEM, {
        stack: error.stack,
        recoverable,
      });
    } else {
      appError = error;
    }

    if (shouldLog) {
      logError(appError);
    }

    if (showToast) {
      showError({
        title: 'Error',
        message: appError.message,
        life: 5000,
      });
    }

    return appError;
  };

  const handleApiError = (error: ApiError, context?: Record<string, unknown>): AppError => {
    let message = 'Network error occurred';
    let type = ErrorType.NETWORK;

    if (error.response) {
      // HTTP error response
      const status = error.response.status;
      message = error.response.statusText || `HTTP ${status} Error`;
      type = ErrorType.API;

      if (error.response.data?.message) {
        message = error.response.data.message;
      }
    } else if (error.message) {
      message = error.message;
      if (error.message.includes('network') || error.message.includes('fetch')) {
        type = ErrorType.NETWORK;
      }
    }

    const appError = createError(message, type, {
      ...context,
      originalError: error,
      url: error.config?.url,
      method: error.config?.method,
    });

    return handleError(appError, { showToast: true, logError: true });
  };

  const reportError = (error: Error, context?: Record<string, unknown>) => {
    if (errorBoundary) {
      errorBoundary.reportError(error, context);
    } else {
      handleError(error, { showToast: true, logError: true });
    }
  };

  const clearErrors = () => {
    errors.value = [];
  };

  const getErrorsByType = (type: ErrorType) => {
    return errors.value.filter((error) => error.type === type);
  };

  const hasErrors = (type?: ErrorType) => {
    if (!type) {
      return errors.value.length > 0;
    }

    return errors.value.some((error) => error.type === type);
  };

  return {
    errors: readonly(errors),

    // Error creation and handling
    createError,
    handleError,
    handleApiError,
    reportError,

    // Error management
    clearErrors,
    getErrorsByType,
    hasErrors,

    // Error boundary integration
    recover: errorBoundary?.recover || (() => clearErrors()),
  };
};
