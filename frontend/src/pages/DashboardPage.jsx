import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';

const overviewCards = [
  {
    title: 'Authentication status',
    icon: '◈',
    description: 'Secure sessions and refresh rotation are enabled.'
  },
  {
    title: 'Access control',
    icon: '◇',
    description: 'Protected routes require authentication and role-aware checks.'
  },
  {
    title: 'Operational readiness',
    icon: '◌',
    description: 'The platform exposes health and API documentation endpoints.'
  }
];

export function DashboardPage() {
  return (
    <Grid container spacing={3}>
      {overviewCards.map((card) => (
        <Grid item xs={12} md={4} key={card.title}>
          <Card
            sx={{
              height: '100%',
              transition: 'transform .2s ease, box-shadow .2s ease',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 }
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                <Typography color="primary" sx={{ fontSize: 28 }} aria-hidden="true">
                  {card.icon}
                </Typography>
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
