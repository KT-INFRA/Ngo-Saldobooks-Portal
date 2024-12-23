import { ReactNode } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// types
import { CardLayoutTypes } from 'pages/dashboard/default';
import { formateCurrency } from 'utils/currency';
import { Divider } from '@mui/material';

interface Props {
  card: CardLayoutTypes;
  iconPrimary: ReactNode;
}

// ==============================|| CHART WIDGET - ECOMMERCE CARD  ||============================== //

export default function DashboardDataCard({ card, iconPrimary }: Props) {
  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar variant="rounded" color={card.color}>
                {iconPrimary}
              </Avatar>
              <Typography variant="subtitle1">{card?.title}</Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 1, bgcolor: 'secondary.100', borderRadius: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={5} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                <Typography fontWeight={'bold'} variant="subtitle2">
                  EAP
                </Typography>
                <Typography>{card?.type === 'amount' ? formateCurrency(card.budget.EAP, { label: true, decimal: true }) : card.budget.EAP}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Divider orientation="vertical" />
              </Grid>
              <Grid item xs={5} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                <Typography fontWeight={'bold'} variant="subtitle2">
                  AICRP
                </Typography>
                <Typography>{card?.type === 'amount' ? formateCurrency(card.budget.AICRP, { label: true, decimal: true }) : card.budget.AICRP}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
}
