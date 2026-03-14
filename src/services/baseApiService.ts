import ky, { HTTPError, TimeoutError } from 'ky';
import type { ApiErrorInfo, ApiErrorHandler } from '@/types/errors';

interface ApiOptions {
  prefixUrl?: string;
  timeout?: number;
  retry?: number;
  headers?: Record<string, string>;
  json?: unknown;
  [key: string]: unknown;
}

type LoadingWrapper = <T>(key: string, apiCall: () => Promise<T>) => Promise<T | undefined>;

interface ApiConfig {
  baseUrl?: string;
  defaultOptions?: ApiOptions;
  withLoading?: LoadingWrapper;
}

interface RequestParams {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  data?: unknown;
  options?: ApiOptions;
}

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

let errorHandler: ApiErrorHandler | null = null;

export function registerErrorHandler(handler: ApiErrorHandler) {
  errorHandler = handler;
}

const createDefaultOptions = (baseUrl: string, options: ApiOptions = {}): ApiOptions => ({
  prefixUrl: baseUrl,
  timeout: 30000,
  retry: 2,
  headers: {
    'Content-Type': 'application/json',
  },
  ...options,
});

const buildErrorInfo = async (
  error: unknown,
  endpoint: string,
  method: string,
): Promise<ApiErrorInfo> => {
  if (error instanceof HTTPError) {
    let responseData: Record<string, unknown> = {};
    try {
      responseData = await error.response.clone().json();
    } catch {
      // response body is not JSON
    }

    return {
      message: `HTTP ${error.response.status}: ${error.response.statusText}`,
      type: 'http',
      status: error.response.status,
      statusText: error.response.statusText,
      endpoint,
      method,
      responseData,
    };
  }

  if (error instanceof TimeoutError) {
    return {
      message: 'Request timeout - please check your connection',
      type: 'timeout',
      endpoint,
      method,
    };
  }

  if (error instanceof Error) {
    const isNetwork = error.message.includes('Failed to fetch');
    return {
      message: isNetwork ? 'Network error - please check your connection' : error.message,
      type: isNetwork ? 'network' : 'unknown',
      endpoint,
      method,
    };
  }

  return {
    message: 'Unknown network error occurred',
    type: 'unknown',
    endpoint,
    method,
  };
};

const notifyError = (errorInfo: ApiErrorInfo) => {
  if (errorHandler) {
    errorHandler(errorInfo);
  }
};

export const createApiClient = (config: ApiConfig = {}) => {
  const { baseUrl = DEFAULT_BASE_URL, defaultOptions = {}, withLoading } = config;
  const baseOptions = createDefaultOptions(baseUrl, defaultOptions);

  const rawRequest = async <T>({
    method,
    endpoint,
    data,
    options = {},
  }: RequestParams): Promise<T> => {
    const kyMethod = method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';
    const requestOptions: ApiOptions = {
      ...baseOptions,
      ...(data !== undefined ? { json: data } : {}),
      ...options,
    };

    try {
      return await ky[kyMethod](endpoint, requestOptions).json<T>();
    } catch (error) {
      const errorInfo = await buildErrorInfo(error, endpoint, method);
      notifyError(errorInfo);
      throw error;
    }
  };

  const request = <T>(params: RequestParams, key?: string): Promise<T | undefined> => {
    const loadingKey = key ?? `${params.method}:${params.endpoint}`;

    if (withLoading) {
      return withLoading<T>(loadingKey, () => rawRequest<T>(params));
    }

    return rawRequest<T>(params);
  };

  const get = <T>(endpoint: string, options?: ApiOptions, key?: string) =>
    request<T>({ method: 'GET', endpoint, options }, key);

  const post = <T>(endpoint: string, data?: unknown, options?: ApiOptions, key?: string) =>
    request<T>({ method: 'POST', endpoint, data, options }, key);

  const put = <T>(endpoint: string, data?: unknown, options?: ApiOptions, key?: string) =>
    request<T>({ method: 'PUT', endpoint, data, options }, key);

  const patch = <T>(endpoint: string, data?: unknown, options?: ApiOptions, key?: string) =>
    request<T>({ method: 'PATCH', endpoint, data, options }, key);

  const del = <T>(endpoint: string, options?: ApiOptions, key?: string) =>
    request<T>({ method: 'DELETE', endpoint, options }, key);

  return { get, post, put, patch, delete: del };
};
