import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { menuItems } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useApiError } from '../hooks/useApiError';
import type { MenuItem } from '../types';

export default function MenuItems() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { error, handleError } = useApiError();

  const { data: items = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
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

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Typography color="error">Error loading menu items. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">Menu Items</Typography>
            {user?.role === 'admin' && (
              <Button variant="contained" color="primary">
                Add New Item
              </Button>
            )}
          </Box>
        </Grid>

        {/* Search */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Menu Items Grid */}
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              {item.image_url && (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image_url}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Rating value={item.average_rating} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({item.average_rating.toFixed(1)})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Added: ${new Date(item.created_at).toLocaleDateString()}`}
                    size="small"
                    variant="outlined"
                  />
                  {user?.role === 'admin' && (
                    <Chip
                      label="Edit"
                      size="small"
                      color="primary"
                      onClick={() => {/* Handle edit */}}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {filteredItems.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              No menu items found matching your search.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 