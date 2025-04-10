import { Button, Container, Typography } from '@mui/material';

const FirePage = () => {
  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Fire Detection
        </Typography>
        <Typography variant="h6" gutterBottom>
          No Alerts Right Now
        </Typography>
        <Button variant="contained" color="primary">
          Start a fire drill
        </Button>
      </Container>
    </>
  );
};

export default FirePage;
