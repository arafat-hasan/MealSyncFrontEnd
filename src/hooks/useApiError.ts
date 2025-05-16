import { useState, useCallback } from 'react';
import type { ErrorResponse } from '../types';
import { useSnackbar } from './useSnackbar';

interface ApiError extends Error {
  response?: {
    data: ErrorResponse;
    status: number;
  };
}

export function useApiError() {
  const [error, setError] = useState<ApiError | null>(null);
  const { showError } = useSnackbar();

  const handleError = useCallback((error: ApiError) => {
    setError(error);
    const errorMessage = error.response?.data?.error || error.message;
    showError(errorMessage);
  }, [showError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> => {
    let lastError: ApiError | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err as ApiError;
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
          continue;
        }
        break;
      }
    }
    
    handleError(lastError!);
    throw lastError;
  }, [handleError]);

  return {
    error,
    handleError,
    clearError,
    retryOperation,
  };
} 