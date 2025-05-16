import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  ArrowForward as ArrowForwardIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useMealEvents } from '../hooks/useMealEvents';
import { useAuth } from '../contexts/AuthContext';
import { useApiError } from '../hooks/useApiError';
import VirtualizedList from '../components/VirtualizedList';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';

type SortOption = 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc';

const ITEM_HEIGHT = 300; // Approximate height of each card in pixels

export default function MealEvents() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, isLoading } = useMealEvents();
  const { error, handleError } = useApiError();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [filterPast, setFilterPast] = useState(false);

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 300),
    []
  );

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const isPast = dayjs(event.event_date).isBefore(dayjs(), 'day');
        return matchesSearch && (!filterPast || !isPast);
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-asc':
            return dayjs(a.event_date).diff(dayjs(b.event_date));
          case 'date-desc':
            return dayjs(b.event_date).diff(dayjs(a.event_date));
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [events, searchTerm, sortBy, filterPast]);

  const renderEventCard = (event: typeof events[0], index: number) => (
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
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`Cutoff: ${dayjs(event.cutoff_time).format('MMM D, h:mm A')}`}
              color="primary"
              size="small"
            />
            {dayjs(event.event_date).isBefore(dayjs(), 'day') && (
              <Chip label="Past Event" color="default" size="small" />
            )}
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
  );

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
        <Typography color="error">Error loading meal events. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Meal Events</Typography>
            {user?.role === 'admin' && (
              <Button
                variant="contained"
                onClick={() => navigate('/admin/meals/new')}
              >
                Create Event
              </Button>
            )}
          </Box>
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Search Events"
                    onChange={(e) => handleSearch(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon color="action" />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                      <MenuItem value="date-asc">Date (Earliest First)</MenuItem>
                      <MenuItem value="date-desc">Date (Latest First)</MenuItem>
                      <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                      <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant={filterPast ? 'contained' : 'outlined'}
                    onClick={() => setFilterPast(!filterPast)}
                    fullWidth
                  >
                    {filterPast ? 'Show All Events' : 'Hide Past Events'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Event List */}
        <Grid item xs={12}>
          <Box sx={{ height: 'calc(100vh - 300px)' }}>
            <VirtualizedList
              items={filteredEvents}
              itemHeight={ITEM_HEIGHT}
              renderItem={renderEventCard}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
} 