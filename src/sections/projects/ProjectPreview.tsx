import { useState } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
// import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ListItemText from '@mui/material/ListItemText';
// import ListItemAvatar from '@mui/material/ListItemAvatar';

// third-party
// import { PatternFormat } from 'react-number-format';
// import { PDFDownloadLink } from '@react-pdf/renderer';

// project-imports
import AlertProjectDelete from './AlertProjectDelete';
// import ListCard from './export-pdf/ListCard';

import MainCard from 'components/MainCard';
// import Avatar from 'components/@extended/Avatar';
import SimpleBar from 'components/third-party/SimpleBar';
import { PopupTransition } from 'components/@extended/Transitions';

// import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// types
import { ProjectList } from 'types/project';

import dayjs from 'dayjs';
import { formateCurrency } from 'utils/currency';

interface Props {
  project: ProjectList;
  open: boolean;
  onClose: () => void;
  editProject: () => void;
}

// ==============================|| PROJECT - PREVIEW ||============================== //

export default function ProjectPreview({ project, open, onClose, editProject }: Props) {
  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [openAlert, setOpenAlert] = useState(false);
  const duration = `${project.duration} Months - End by ${dayjs(project.start_date).add(project.duration, 'months').format('MMMM YYYY')}`;

  const handleClose = () => {
    setOpenAlert(!openAlert);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={PopupTransition}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          '& .MuiDialog-paper': {
            width: { xs: '90%', md: '48%', sm: '90%' },
            // maxHeight: 'max-content',
            maxWidth: 1,
            m: { xs: 1.75, sm: 2.5, md: 4 }
          }
        }}
      >
        <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1 }}>
          <DialogTitle sx={{ px: 0 }}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem disablePadding>
                <ListItemText
                  primary={
                    <Typography color={'primary'} variant="h5">
                      {project.project_code}
                    </Typography>
                  }
                  secondary={
                    <Chip
                      sx={{ mt: 1 }}
                      size="small"
                      color="primary"
                      variant="combined"
                      label={dayjs(project.start_date).format('DD, MMMM, YYYY')}
                    ></Chip>
                  }
                />
              </ListItem>
            </List>
          </DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <SimpleBar sx={{ height: 'max-content' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} xl={12}>
                  <Grid container spacing={2.25}>
                    <Grid item xs={12}>
                      <MainCard title="Project Name">
                        <Typography>{project.title}</Typography>
                      </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                      <MainCard title="Details">
                        <List sx={{ py: 0 }}>
                          <ListItem divider>
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">Project Group Name</Typography>
                                  <Typography>{project.project_group_name}</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">Approved Budget</Typography>
                                  {/* <Chip
                                    sx={{ mt: 1 }}
                                    size="small"
                                    color="success"
                                    variant="combined"
                                    label={project.approved_budget}
                                    sx={{width:'max-content'}}
                                  ></Chip> */}
                                  <Typography variant="subtitle1" color={'green'}>
                                    {formateCurrency(project.approved_budget)}
                                  </Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItem>
                          <ListItem divider>
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">Funding Agency</Typography>
                                  {/* <Chip
                                    color="primary"
                                    variant="combined"
                                    size="small"
                                    label={'Not Available'}
                                    sx={{ color: 'text.primary', width: 'max-content' }}
                                  /> */}
                                  <Typography>{'-'}</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">Fund Received</Typography>
                                  <Typography>{formateCurrency(0)}</Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItem>
                          <ListItem>
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">Duration</Typography>
                                  <Typography>{duration}</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="secondary">Fund Spend</Typography>
                                  <Typography>{formateCurrency(project.consumed_amount)}</Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItem>
                        </List>
                      </MainCard>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </SimpleBar>
          </DialogContent>
          <DialogActions>
            <Button color="error" variant="contained" onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <AlertProjectDelete id={project.id!} title={project.project_code} open={openAlert} handleClose={handleClose} />
    </>
  );
}
