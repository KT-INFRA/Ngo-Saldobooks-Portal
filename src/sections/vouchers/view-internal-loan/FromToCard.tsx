import { FormControl, Stack, Tooltip, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useViewInternalLoanContext } from 'pages/vouchers/view-internal-loan/view-internal-loan-context';

function FromToCard() {
  const { selectedLoan } = useViewInternalLoanContext()!;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <MainCard sx={{ height: '100%' }}>
          <Tooltip title={selectedLoan?.from_project_name}>
            <Stack spacing={1} sx={{ height: '100%' }}>
              <Typography variant="h5">From:</Typography>

              <FormControl sx={{ width: '100%' }}>
                <Typography variant="subtitle2">{selectedLoan?.from_project_code}</Typography>
                <Typography
                  variant="body1"
                  color="secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {selectedLoan?.from_project_name}
                </Typography>
              </FormControl>
            </Stack>
          </Tooltip>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <MainCard sx={{ height: '100%' }}>
          <Tooltip title={selectedLoan?.project_name}>
            <Stack spacing={1} sx={{ height: '100%' }}>
              <Typography variant="h5">To:</Typography>

              <FormControl sx={{ width: '100%' }}>
                <Typography variant="subtitle2">{selectedLoan?.project_code}</Typography>
                <Typography
                  color="secondary"
                  variant="body1"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {selectedLoan?.project_name}
                </Typography>
              </FormControl>
            </Stack>
          </Tooltip>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <MainCard sx={{ height: '100%' }}>
          <Stack spacing={1} sx={{ height: '100%' }}>
            <FormControl sx={{ width: '100%' }}>
              <Typography variant="h5">{'Narration'}</Typography>
              <Typography
                color="secondary"
                variant="body1"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {selectedLoan?.narration}
              </Typography>
            </FormControl>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default FromToCard;
