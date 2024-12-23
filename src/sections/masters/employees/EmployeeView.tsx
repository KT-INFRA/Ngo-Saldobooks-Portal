// material-ui
//import { useTheme } from '@mui/material/styles';
//import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
//import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// ==============================|| CUSTOMER - VIEW ||============================== //

export default function View({ data }: any) {
  //const theme = useTheme();
  //const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Transitions type="slide" direction="down" in={true}>
      <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        <Grid item xs={12}>
          <Stack spacing={2.5}>
            <MainCard title="Details">
              <List sx={{ py: 0 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" color="secondary">
                        EMPLOYEE ID
                      </Typography>
                      <Typography>{data.emp_id}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" color="secondary">
                        NAME
                      </Typography>
                      <Typography>{`${data.prefix} ${data.first_name} ${data.last_name}`}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" color="secondary">
                        MOBILE
                      </Typography>
                      <Typography>{data.phone}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" color="secondary">
                        DIVISION
                      </Typography>
                      <Typography>{data.division_name}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" color="secondary">
                        DESIGNATION
                      </Typography>
                      <Typography>{data.designation_name}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" color="secondary">
                        PERMANENT EMPLOYEE
                      </Typography>
                      <Typography>{data.is_permanent_emp ? 'YES' : 'NO'}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </List>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </Transitions>
  );
}
