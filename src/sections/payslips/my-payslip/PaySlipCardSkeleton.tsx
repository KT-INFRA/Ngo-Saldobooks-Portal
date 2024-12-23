import { Grid, Skeleton } from '@mui/material';
import { Stack } from '@mui/material';
import MainCard from 'components/MainCard';

interface IPaySlipCardSkeletonProps {
  loading: boolean;
  content: React.ReactNode; // MainCard content (it should be provided)
}
export default function PaySlipCardSkeleton({ loading, content }: IPaySlipCardSkeletonProps) {
  if (!loading) {
    return content;
  }
  return (
    <Grid item xs={12} md={12}>
      <MainCard content={false} sx={{ mt: 1, backgroundColor: 'transparent', border: 'none' }}>
        <Stack gap={1}>
          {[1, 2].map(() => (
            <Stack gap={2}>
              <Skeleton sx={{ m: 0, p: 0 }} width={50} height={30} animation="wave"></Skeleton>
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Skeleton variant="rounded" height={90} animation="wave" />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ))}
        </Stack>
      </MainCard>
    </Grid>
  );
}
