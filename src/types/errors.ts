export enum ErrorType {
  NETWORK = 'network',
  SYSTEM = 'system',
  API = 'api',
  UNKNOWN = 'unknown',
}

export interface AppError {
  id: string;
  type: ErrorType;
  message: string;
  stack?: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  recoverable?: boolean;
}

export interface ApiError {
  message?: string;
  response?: {
    status: number;
    statusText?: string;
    data?: {
      message?: string;
    };
  };
  config?: {
    url?: string;
    method?: string;
  };
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  reportError?: boolean;
  recoverable?: boolean;
}

export interface ApiErrorInfo {
  message: string;
  type: 'http' | 'timeout' | 'network' | 'unknown';
  status?: number;
  statusText?: string;
  endpoint?: string;
  method?: string;
  responseData?: Record<string, unknown>;
}

export type ApiErrorHandler = (errorInfo: ApiErrorInfo) => void;
