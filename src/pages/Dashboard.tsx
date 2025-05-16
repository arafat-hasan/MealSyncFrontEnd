import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  CardActions,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useMealEvents } from '../hooks/useMealEvents';
import dayjs from 'dayjs';

export default function Dashboard() {
  const navigate = useNavigate();
  const { events, isLoading } = useMealEvents();
  const [displayCount, setDisplayCount] = useState(3);

  const upcomingEvents = events
    .filter((event) => dayjs(event.event_date).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.event_date).diff(dayjs(b.event_date)))
    .slice(0, displayCount);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Welcome to MealSync
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your upcoming meal events and requests are shown below.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Upcoming Events
          </Typography>
          <Grid container spacing={3}>
            {upcomingEvents.map((event) => (
              <Grid item xs={12} md={4} key={event.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {event.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {event.description}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {dayjs(event.event_date).format('MMM D, YYYY')}
                      </Typography>
                    </Box>
                    {event.addresses.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {event.addresses[0].address.name}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={`Cutoff: ${dayjs(event.cutoff_time).format('MMM D, h:mm A')}`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/meals/${event.id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          {events.length > displayCount && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setDisplayCount((prev) => prev + 3)}
              >
                Show More
              </Button>
            </Box>
          )}
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">View All Events</Typography>
                  <Typography variant="body2" color="text.secondary">
                    See all upcoming meal events
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate('/meals')}>
                    Go to Events
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Menu Items</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Browse available menu items
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate('/menu-items')}>
                    View Menu
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
} 