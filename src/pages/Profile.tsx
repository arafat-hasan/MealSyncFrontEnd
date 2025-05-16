import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../hooks/useSnackbar';

export default function Profile() {
  const { user } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    notification_enabled: user?.notification_enabled || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'notification_enabled' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement profile update API call
      showSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      showError('Failed to update profile');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Personal Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Preferences
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="notification_enabled"
                          checked={formData.notification_enabled}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      }
                      label="Enable Notifications"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      {!isEditing ? (
                        <Button
                          variant="contained"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            type="submit"
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setIsEditing(false);
                              setFormData({
                                name: user?.name || '',
                                email: user?.email || '',
                                department: user?.department || '',
                                notification_enabled: user?.notification_enabled || false,
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Employee ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {user?.employee_id}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Role
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ textTransform: 'capitalize' }}>
                  {user?.role}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Account Created
                </Typography>
                <Typography variant="body1">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 