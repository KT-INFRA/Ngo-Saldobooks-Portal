import dayjs from 'dayjs';

// material-ui
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party

// project-imports
import MainCard from 'components/MainCard';

// assets

// types
import { ProjectList } from 'types/project';
// import ProjectPreview from './ProjectPreview';
import { formateCurrency } from 'utils/currency';
import { Medal } from 'iconsax-react';
import { useNavigate } from 'react-router';
import { Box } from '@mui/material';

// ==============================|| PROJECT - CARD ||============================== //

export default function SubProjectCard({ project, onNavigate }: { project: ProjectList; onNavigate: () => void }) {
  const navigate = useNavigate();

  const handleLongClickOpen = () => {
    onNavigate();
    navigate(`/projects/details`, {
      state: {
        projectId: project.id,
        isSubProject: true
      }
    });
  };

  return (
    <Box
      sx={{
        '&:hover': {
          transition: 'transform 0.2s ease-in',
          transform: 'scale(1.01)'
        }
      }}
      style={{ cursor: 'pointer' }}
      onClick={handleLongClickOpen}
    >
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        {project.is_draft && (
          <Chip
            variant="light"
            color="primary"
            label="Draft"
            size="small"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              borderTopLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 10
            }}
          ></Chip>
        )}
        {project.is_draft === false && (
          <Chip
            size={'small'}
            variant={project.is_active ? 'light' : 'light'}
            color={project.is_active ? 'success' : 'error'}
            label={project.is_active ? 'Active' : 'Completed'}
            sx={{ position: 'absolute', top: 0, right: 0, borderTopLeftRadius: 0, borderBottomRightRadius: 0, borderBottomLeftRadius: 10 }}
          ></Chip>
        )}
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0, mt: 0 }}>
              <ListItem disablePadding>
                <ListItemText
                  primary={
                    <Stack direction={'row'} p={0} m={0}>
                      {project?.master_project ? (
                        <Typography p={0} ml={-0.5} color={'primary.main'}>
                          <Medal size={20} />
                        </Typography>
                      ) : null}
                      <Typography fontSize={13} noWrap={false} maxWidth={'85%'} variant="h5">
                        {project?.project_code}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography fontSize={12} noWrap={true} maxWidth={'85%'}>
                      {project.title}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} direction={{ xs: 'column', md: 'row' }}>
              <Grid item xs={12}>
                <List
                  sx={{
                    p: 0,
                    overflow: 'hidden',
                    '& .MuiListItem-root': { px: 0, py: 0.5 },
                    '& .MuiListItemIcon-root': { minWidth: 28 }
                  }}
                >
                  {[
                    {
                      label: 'Project Group Name',
                      key: 'projectGroupName',
                      type: 'node',
                      value: <Chip color="warning" variant="outlined" size="small" label={project.project_group_name}></Chip>
                    },
                    {
                      label: 'Funding Agency',
                      key: 'fundingAgency',
                      type: 'text',
                      value: '-'
                    },
                    {
                      label: 'Duration',
                      key: 'duration',
                      type: 'text',
                      value: `${project.duration} Months - End by ${dayjs(project.start_date).add(project.duration, 'months').format('MMMM YYYY')}`
                    },
                    {
                      label: 'Approved Budget',
                      key: 'approvedBudget',
                      type: 'text',
                      value: formateCurrency(project?.approved_budget)
                    },
                    {
                      label: 'Fund Received',
                      key: 'fundingReceived',
                      type: 'text',
                      value: formateCurrency(0)
                    },
                    {
                      label: 'Fund Spend',
                      key: 'fundingSpend',
                      type: 'text',
                      value: formateCurrency(project.consumed_amount)
                    }
                  ].map(({ label, value, type }) => {
                    return (
                      <Stack gap={0.4} mb={1.5} width={'100%'} display={'flex'} direction={'row'} justifyContent={'space-between'}>
                        <Typography fontSize={13} variant="body1" mb={0.5} fontWeight={'500'} color="text.black">
                          {label}
                        </Typography>
                        {type === 'node' ? (
                          value
                        ) : (
                          <Typography fontSize={12} variant="body1" color="text.secondary">
                            {value}
                          </Typography>
                        )}
                      </Stack>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
}
