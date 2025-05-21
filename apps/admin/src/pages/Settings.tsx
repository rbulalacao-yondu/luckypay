import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import api, { endpoints } from '../services/api';

interface SystemSettings {
  siteName: string;
  emailNotifications: boolean;
  darkMode: boolean;
  sessionTimeoutMinutes: number;
}

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'LuckyPay Admin',
    emailNotifications: true,
    darkMode: false,
    sessionTimeoutMinutes: 30,
  });

  useEffect(() => {
    // Fetch settings on component mount
    const fetchSettings = async () => {
      setIsFetching(true);
      try {
        const { data } = await api.get(endpoints.settings.get);
        console.log('Fetched system settings:', data);
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setError(
          'Failed to load system settings. Please try refreshing the page.',
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Real API call to update settings
      await api.put(endpoints.settings.update, settings);
      console.log('Settings updated successfully:', settings);
      setSuccessMessage('Settings updated successfully');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      console.error('Failed to update settings:', err);
      setError(
        err.response?.data?.message ||
          'Failed to update settings. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        System Settings
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="h6">General Settings</Typography>
              <Divider sx={{ my: 1 }} />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Site Name"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <TextField
                fullWidth
                label="Session Timeout (minutes)"
                name="sessionTimeoutMinutes"
                type="number"
                value={settings.sessionTimeoutMinutes}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Preferences
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleSwitchChange}
                    disabled={isLoading}
                  />
                }
                label="Email Notifications"
              />

              <FormControlLabel
                control={
                  <Switch
                    name="darkMode"
                    checked={settings.darkMode}
                    onChange={handleSwitchChange}
                    disabled={isLoading}
                  />
                }
                label="Dark Mode"
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Save Settings'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
