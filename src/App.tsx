import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from './hooks/useSnackbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import theme from './theme';

// Pages
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import MealEvents from './pages/MealEvents.tsx';
import MealEventDetail from './pages/MealEventDetail.tsx';
import MenuItems from './pages/MenuItems.tsx';
import MenuSets from './pages/MenuSets.tsx';
import Profile from './pages/Profile.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});

function FallbackComponent({ error }: { error: Error }) {
  console.error('ErrorBoundary: Caught error:', error);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" color="error" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="error">
        {error.message}
      </Typography>
    </Box>
  );
}

function App() {
  console.log('App: Component rendering');

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
            <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
              <AuthProvider>
                <Router>
                  <Routes>
                    {console.log('App: Defining routes')}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Routes */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/meals"
                      element={
                        <ProtectedRoute>
                          <MealEvents />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/meals/:id"
                      element={
                        <ProtectedRoute>
                          <MealEventDetail />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/menu-items"
                      element={
                        <ProtectedRoute>
                          <MenuItems />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/menu-sets"
                      element={
                        <ProtectedRoute>
                          <MenuSets />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Router>
              </AuthProvider>
            </Box>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
