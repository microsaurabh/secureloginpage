import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';

const overviewCards = [
  {
    title: 'Authentication status',
    description: 'Secure sessions and refresh rotation are enabled.'
  },
  {
    title: 'Access control',
    description: 'Protected routes require authentication and role-aware checks.'
  },
  {
    title: 'Operational readiness',
    description: 'The platform exposes health and API documentation endpoints.'
  }
];

export function DashboardPage() {
  return (
    <Grid container spacing={3}>
      {overviewCards.map((card) => (
        <Grid item xs={12} md={4} key={card.title}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">{card.title}</Typography>
                <Typography color="text.secondary">{card.description}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
