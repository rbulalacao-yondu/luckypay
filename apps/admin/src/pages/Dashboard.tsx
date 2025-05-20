import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

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
          <Typography variant="h4">1,234</Typography>
        </StyledPaper>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Active Users
          </Typography>
          <Typography variant="h4">987</Typography>
        </StyledPaper>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Total Transactions
          </Typography>
          <Typography variant="h4">5,678</Typography>
        </StyledPaper>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Revenue
          </Typography>
          <Typography variant="h4">₱123,456</Typography>
        </StyledPaper>
      </Box>
    </Box>
  );
}
