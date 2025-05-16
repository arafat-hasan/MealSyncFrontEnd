import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import { mealEvents } from '../services/api';
import { useApiError } from '../hooks/useApiError';

export default function MealEventDetail() {
  const { id } = useParams<{ id: string }>();
  const { error, handleError } = useApiError();

  const { data: event, isLoading } = useQuery({
    queryKey: ['mealEvent', id],
    queryFn: async () => {
      try {
        const { data } = await mealEvents.get(Number(id));
        return data;
      } catch (err) {
        handleError(err as Error);
        throw err;
      }
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading meal event. Please try again later.</Typography>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Meal event not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {event.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {event.description}
      </Typography>
      {/* Add more details as needed */}
    </Box>
  );
} 