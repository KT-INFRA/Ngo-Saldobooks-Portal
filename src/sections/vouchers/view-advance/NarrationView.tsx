import { FormControl, Stack, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { useViewAdvanceContext } from 'pages/vouchers/view-advance/view-advance-context';

function NarrationView() {
  const { selectedAdvance } = useViewAdvanceContext()!;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <Stack spacing={1} sx={{ height: '100%' }}>
          <FormControl sx={{ width: '100%' }}>
            <Typography variant="h5">{'Narration'}</Typography>
            <Typography
              color="secondary"
              variant="body1"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {selectedAdvance?.narration}
            </Typography>
          </FormControl>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default NarrationView;
