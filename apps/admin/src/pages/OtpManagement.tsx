import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  useOtpConfig,
  useUpdateOtpConfig,
} from '../hooks/queries/useOtpConfig';

export default function OtpManagement() {
  const { data: config, isLoading, error } = useOtpConfig();
  const updateConfig = useUpdateOtpConfig();
  const [formData, setFormData] = useState({
    expiryMinutes: '',
    maxAttempts: '',
    cooldownMinutes: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  if (isLoading) {
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

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading OTP configuration</Typography>
      </Box>
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedConfig = {
      expiryMinutes: parseInt(
        formData.expiryMinutes || config?.expiryMinutes.toString() || '0',
      ),
      maxAttempts: parseInt(
        formData.maxAttempts || config?.maxAttempts.toString() || '0',
      ),
      cooldownMinutes: parseInt(
        formData.cooldownMinutes || config?.cooldownMinutes.toString() || '0',
      ),
    };

    updateConfig.mutate(updatedConfig, {
      onSuccess: () => {
        setSuccessMessage('OTP configuration updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        OTP Management
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="OTP Expiry (minutes)"
              name="expiryMinutes"
              type="number"
              value={formData.expiryMinutes || config?.expiryMinutes || ''}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1 } }}
            />
            <TextField
              fullWidth
              label="Maximum Attempts"
              name="maxAttempts"
              type="number"
              value={formData.maxAttempts || config?.maxAttempts || ''}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1 } }}
            />
            <TextField
              fullWidth
              label="Cooldown Period (minutes)"
              name="cooldownMinutes"
              type="number"
              value={formData.cooldownMinutes || config?.cooldownMinutes || ''}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1 } }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={updateConfig.isPending}
            >
              {updateConfig.isPending ? (
                <CircularProgress size={24} />
              ) : (
                'Save Changes'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
