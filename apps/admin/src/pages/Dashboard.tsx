import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDashboardStats } from '../hooks/queries/useDashboardStats';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

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
        <Typography color="error">Error loading dashboard data</Typography>
      </Box>
    );
  }

  return (
    <Box component="div">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Total Users
          </Typography>
          <Typography variant="h4">
            {stats?.totalUsers.toLocaleString()}
          </Typography>
        </StyledPaper>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Active Users
          </Typography>
          <Typography variant="h4">
            {stats?.activeUsers.toLocaleString()}
          </Typography>
        </StyledPaper>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Total Transactions
          </Typography>
          <Typography variant="h4">
            {stats?.totalTransactions.toLocaleString()}
          </Typography>
        </StyledPaper>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Revenue
          </Typography>
          <Typography variant="h4">
            ₱{stats?.revenue.toLocaleString()}
          </Typography>
        </StyledPaper>
      </Box>
    </Box>
  );
}
