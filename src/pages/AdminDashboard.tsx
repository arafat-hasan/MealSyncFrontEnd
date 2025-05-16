import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mealEvents, menuItems, menuSets } from '../services/api';
import { useApiError } from '../hooks/useApiError';
import dayjs from 'dayjs';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { error, handleError } = useApiError();

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['adminMealEvents'],
    queryFn: async () => {
      try {
        const { data } = await mealEvents.list(
          dayjs().format('YYYY-MM-DD'),
          dayjs().add(30, 'days').format('YYYY-MM-DD')
        );
        return data;
      } catch (err) {
        handleError(err as Error);
        throw err;
      }
    },
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['adminMenuItems'],
    queryFn: async () => {
      try {
        const { data } = await menuItems.list();
        return data;
      } catch (err) {
        handleError(err as Error);
        throw err;
      }
    },
  });

  const { data: sets = [], isLoading: setsLoading } = useQuery({
    queryKey: ['adminMenuSets'],
    queryFn: async () => {
      try {
        const { data } = await menuSets.list();
        return data;
      } catch (err) {
        handleError(err as Error);
        throw err;
      }
    },
  });

  if (eventsLoading || itemsLoading || setsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading dashboard data. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              <Typography variant="h3" color="primary">
                {events.length}
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate('/meals')}
                sx={{ mt: 1 }}
              >
                View All Events
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Menu Items
              </Typography>
              <Typography variant="h3" color="primary">
                {items.length}
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate('/menu-items')}
                sx={{ mt: 1 }}
              >
                Manage Items
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Menu Sets
              </Typography>
              <Typography variant="h3" color="primary">
                {sets.length}
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate('/menu-sets')}
                sx={{ mt: 1 }}
              >
                Manage Sets
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Events */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Events
              </Typography>
              <List>
                {events.slice(0, 5).map((event) => (
                  <Box key={event.id}>
                    <ListItem>
                      <ListItemText
                        primary={event.name}
                        secondary={dayjs(event.event_date).format('MMM D, YYYY')}
                      />
                      <Button
                        size="small"
                        onClick={() => navigate(`/meals/${event.id}`)}
                      >
                        View
                      </Button>
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Menu Sets */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Menu Sets
              </Typography>
              <List>
                {sets.slice(0, 5).map((set) => (
                  <Box key={set.id}>
                    <ListItem>
                      <ListItemText
                        primary={set.menu_set_name}
                        secondary={`${set.menu_set_items.length} items`}
                      />
                      <Button
                        size="small"
                        onClick={() => navigate('/menu-sets')}
                      >
                        View
                      </Button>
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 