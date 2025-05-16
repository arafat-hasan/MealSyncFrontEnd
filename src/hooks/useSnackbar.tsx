import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';

interface SnackbarContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const showMessage = useCallback((message: string, severity: AlertColor = 'info') => {
    setState({
      open: true,
      message,
      severity,
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    showMessage(message, 'success');
  }, [showMessage]);

  const showError = useCallback((message: string) => {
    showMessage(message, 'error');
  }, [showMessage]);

  const showInfo = useCallback((message: string) => {
    showMessage(message, 'info');
  }, [showMessage]);

  const showWarning = useCallback((message: string) => {
    showMessage(message, 'warning');
  }, [showMessage]);

  const contextValue = {
    showSuccess,
    showError,
    showInfo,
    showWarning
  };

  const SnackbarComponent = useCallback(() => (
    <Snackbar
      open={state.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={state.severity} sx={{ width: '100%' }}>
        {state.message}
      </Alert>
    </Snackbar>
  ), [state.open, state.severity, state.message, handleClose]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <SnackbarComponent />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
} 