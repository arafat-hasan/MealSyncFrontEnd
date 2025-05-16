import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { menuSets } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useApiError } from '../hooks/useApiError';
import type { MenuSet } from '../types';

export default function MenuSets() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { error, handleError } = useApiError();

  const { data: sets = [], isLoading } = useQuery<MenuSet[]>({
    queryKey: ['menuSets'],
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

  const filteredSets = sets.filter((set) =>
    set.menu_set_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.menu_set_description.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Typography color="error">Error loading menu sets. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">Menu Sets</Typography>
            {user?.role === 'admin' && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              >
                Create Menu Set
              </Button>
            )}
          </Box>
        </Grid>

        {/* Search */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search menu sets..."
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

        {/* Menu Sets Grid */}
        {filteredSets.map((set) => (
          <Grid item xs={12} md={6} key={set.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {set.menu_set_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {set.menu_set_description}
                    </Typography>
                  </Box>
                  {user?.role === 'admin' && (
                    <Box>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Menu Items ({set.menu_set_items.length})
                </Typography>
                <List dense>
                  {set.menu_set_items.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemText
                        primary={item.menu_item.name}
                        secondary={item.menu_item.description}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  <Chip
                    label={`Created: ${new Date(set.created_at).toLocaleDateString()}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`Updated: ${new Date(set.updated_at).toLocaleDateString()}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {filteredSets.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              No menu sets found matching your search.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 