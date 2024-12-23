import dayjs from 'dayjs';
import { useState } from 'react';

// material-ui
// import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
// import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party

// project-imports
// import IconButton from 'components/@extended/IconButton';
// import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';

// assets

// types
import { ProjectList } from 'types/project';
// import ProjectPreview from './ProjectPreview';
import AlertProjectDelete from './AlertProjectDelete';
// import ProjectModal from './ProjectModal';
// import ProjectPreview from './ProjectPreview';
import { formateCurrency } from 'utils/currency';
// import { ArrowRight, Eye } from 'iconsax-react';
import { useNavigate } from 'react-router';
import { Skeleton } from '@mui/material';
import { Box } from '@mui/material';
import { Medal } from 'iconsax-react';
import { getUserModuleData, UserModuleEnum } from 'utils/modules';

export default function ProjectCard({ project, isLoading }: { project: ProjectList; isLoading: boolean }) {
  const projectModule = getUserModuleData(UserModuleEnum.Projects)!;

  // const [open, setOpen] = useState(false);

  // const [selectedProject, setSelectedProject] = useState<ProjectList | null>(null);
  const navigate = useNavigate();
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  const handleLongClickOpen = () => {
    if (projectModule.access === false) return;
    navigate(`details`, {
      state: {
        projectId: project?.id
      }
    });
  };
  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    // handleMenuClose();
  };

  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const openMenu = Boolean(anchorEl);

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };

  // const editProject = () => {
  //   setSelectedProject(project);
  //   setOpen(true);
  // };

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
              <ListItem
                disablePadding
                // secondaryAction={
                //   !isLoading && (
                //     <IconButton
                //       edge="end"
                //       aria-label="comments"
                //       color="secondary"
                //       onClick={handleMenuClick}
                //       sx={{ transform: 'rotate(90deg)' }}
                //     >
                //       <MoreIcon />
                //     </IconButton>
                //   )
                // }
              >
                <ListItemText
                  primary={
                    !isLoading ? (
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
                    ) : (
                      <Skeleton variant="text" width={100} />
                    )
                  }
                  secondary={
                    !isLoading ? (
                      <Typography fontSize={12} noWrap={true} maxWidth={'85%'}>
                        {project?.title}
                      </Typography>
                    ) : (
                      <Skeleton variant="text" />
                    )
                  }
                />
              </ListItem>
            </List>
            {/* <Menu
              id="fade-menu"
              MenuListProps={{ 'aria-labelledby': 'fade-button' }}
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem sx={{ a: { textDecoration: 'none', color: 'inherit' } }}></MenuItem>
              <MenuItem onClick={editProject}>Edit</MenuItem>
              <MenuItem onClick={handleAlertClose}>Delete</MenuItem>
            </Menu> */}
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
                      value: <Chip color="warning" variant="outlined" size="small" label={project?.project_group_name}></Chip>
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
                      value: `${project?.duration} Months - End by ${dayjs(project?.start_date).add(project?.duration, 'months').format('MMMM YYYY')}`
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
                      value: formateCurrency(project?.consumed_amount)
                    }
                  ].map(({ label, value, type, key }) => {
                    return (
                      <Stack
                        key={key}
                        gap={0.4}
                        mb={1.5}
                        width={'100%'}
                        display={'flex'}
                        direction={'row'}
                        justifyContent={'space-between'}
                      >
                        {!isLoading ? (
                          <Typography fontSize={13} variant="body1" mb={0.5} fontWeight={'500'} color="text.black">
                            {label}
                          </Typography>
                        ) : (
                          <Skeleton width={150} variant="text" />
                        )}
                        {type === 'node' ? (
                          <>{!isLoading ? value : <Skeleton width={50} variant="text" />}</>
                        ) : !isLoading ? (
                          <Typography fontSize={12} variant="body1" color="text.secondary">
                            {value}
                          </Typography>
                        ) : (
                          <Skeleton width={50} variant="text" />
                        )}
                      </Stack>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {!isLoading && (
          <Stack
            direction="row"
            className="hideforPDf"
            alignItems="center"
            spacing={1}
            justifyContent="space-between"
            sx={{ mt: 'auto', mb: 0 }}
          >
            <Typography variant="caption" color="text.secondary">
              {/* Updated in {project.duration} */}
            </Typography>
            <Stack direction={'row'} gap={2}>
              {/* <Button
                // startIcon={<Eye />}
                variant="text"
                size="small"
                onClick={handleLongClickOpen}
              >
                View
              </Button> */}
              {/* <IconButton variant="outlined" size="small" onClick={handleLongClickOpen}>
                <ArrowRight />
              </IconButton> */}
            </Stack>
          </Stack>
        )}
      </MainCard>

      {!isLoading && (
        <>
          {/* <ProjectPreview project={project} open={open} onClose={() => setOpen(false)} editProject={editProject} /> */}
          <AlertProjectDelete id={project?.id!} title={project?.title} open={openAlert} handleClose={handleAlertClose} />
        </>
      )}
    </Box>
  );
}
