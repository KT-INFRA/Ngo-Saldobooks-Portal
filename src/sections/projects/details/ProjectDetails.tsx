// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

// third-party

// project-imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import dayjs from 'dayjs';
import { formateCurrency } from 'utils/currency';
import { CardContent, Chip } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import SimpleBar from 'simplebar-react';
import { useGetProjectDetailsContext } from 'pages/projects/utils';

// assets

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

export default function ProjectDetails() {
  const { project, loading: isLoading } = useGetProjectDetailsContext()!;
  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const getPiUser = () => {
    if (!isLoading && project && project?.pi_user.length > 0 && project.pi_user[0]) {
      const { prefix = '', first_name = '', last_name = '' } = project?.pi_user[0];
      return `${prefix} ${first_name} ${last_name}`;
    }
    return '';
  };

  const fundReceivedPercentage = ((project!.credit_amount / +project!.approved_budget) * 100).toFixed(5);
  const fundSpendPercentage = ((project!.debit_amount / +project!.approved_budget) * 100).toFixed(5);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MainCard>
              <List sx={{ py: 0 }}>
                <ListItem divider>
                  <Grid container spacing={matchDownMD ? 0.5 : 3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Funding Agency</Typography>
                        <Typography variant="subtitle1">{project?.funding_agencies}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Principal Investigator</Typography>
                        <Typography variant="subtitle1">{getPiUser()}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={matchDownMD ? 0.5 : 3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary"> Project Start</Typography>
                        <Typography variant="subtitle1">
                          {project?.start_date ? dayjs(project?.start_date).format('MMMM YYYY') : '-'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Project Duration</Typography>
                        <Typography variant="subtitle1">
                          {project?.duration} Months - End by{' '}
                          {dayjs(project?.start_date).add(project!.duration, 'months').format('MMMM YYYY')}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <AnalyticEcommerce title="Approved Budget" count={formateCurrency(project?.approved_budget ?? 0)} />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <AnalyticEcommerce
                  title="Grant Received"
                  count={formateCurrency(project?.credit_amount ?? 0)}
                  percentage={+fundReceivedPercentage}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <AnalyticEcommerce
                  title="Grant Spent"
                  count={formateCurrency(project?.debit_amount ?? 0)}
                  percentage={+fundSpendPercentage}
                  isLoss
                  color="warning"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} xl={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} xl={6}>
                <MainCard title="CO-PI" content={false}>
                  {/* <Box sx={{ p: 2, pb: 0 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                      <Typography variant="h5">Principal Investigator</Typography>
                    </Stack>
                  </Box> */}
                  <SimpleBar>
                    <CardContent>
                      <Grid container spacing={3} alignItems="center">
                        {!isLoading &&
                          [...project!.co_pi_user_list].map((coPi) => {
                            return (
                              <Grid item xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item>
                                    <Avatar variant="rounded" size="md" alt="coverimage" />
                                  </Grid>
                                  <Grid item xs zeroMinWidth>
                                    <Stack direction={'row'} gap={1}>
                                      <Typography variant="subtitle1" color={'secondary'}>
                                        {coPi?.prefix}
                                      </Typography>
                                      <Typography variant="subtitle1">{coPi?.first_name + coPi?.last_name}</Typography>
                                    </Stack>
                                    <Grid container spacing={2}>
                                      <Grid item xs zeroMinWidth>
                                        <Typography variant="caption" color="text.secondary">
                                          {dayjs(coPi?.effective_date).format('DD-MMM-YYYY')}
                                        </Typography>
                                      </Grid>
                                      <Grid item sx={{ display: 'flex' }}>
                                        <Chip
                                          sx={{ borderRadius: 1 }}
                                          color="primary"
                                          variant="combined"
                                          size={'small'}
                                          label={coPi?.access_type}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </CardContent>
                  </SimpleBar>
                </MainCard>
              </Grid>
              <Grid item xs={12} md={6} xl={6}>
                <MainCard title="Associates" content={false}>
                  {/* <Box sx={{ p: 2, pb: 0 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                      <Typography variant="h5">Associates</Typography>
                    </Stack>
                  </Box> */}
                  <SimpleBar>
                    <CardContent>
                      <Grid container spacing={3} alignItems="center">
                        {!isLoading &&
                          [...project!.associate_user_list]?.map((associate) => {
                            return (
                              <Grid item xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item>
                                    <Avatar variant="rounded" size="md" alt="coverimage" />
                                  </Grid>
                                  <Grid item xs zeroMinWidth>
                                    <Stack direction={'row'} gap={1}>
                                      <Typography variant="subtitle1" color={'secondary'}>
                                        {associate?.prefix}
                                      </Typography>
                                      <Typography variant="subtitle1">{associate?.first_name + associate?.last_name}</Typography>
                                    </Stack>
                                    <Grid container spacing={2}>
                                      <Grid item xs zeroMinWidth>
                                        <Typography variant="caption" color="text.secondary">
                                          {dayjs(associate?.effective_date).format('DD-MMM-YYYY')}
                                        </Typography>
                                      </Grid>
                                      <Grid item sx={{ display: 'flex' }}>
                                        <Chip
                                          sx={{ borderRadius: 1 }}
                                          color="primary"
                                          variant="combined"
                                          size={'small'}
                                          label={associate?.access_type}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </CardContent>
                  </SimpleBar>
                </MainCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
