import { CircularProgress, Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useUpdateProjectCompletedStatus } from 'api/project';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { Switch } from '@mui/material';
import { useState } from 'react';
import { useGetProjectDetailsContext } from 'pages/projects/utils';

function ProjectStatusUpdate() {
  const { project } = useGetProjectDetailsContext();
  const { isLoading: isUpdatingProjectStatus, updateProjectComplete } = useUpdateProjectCompletedStatus(project!.id);

  const { handleGetProjectAgain } = useGetProjectDetailsContext();
  const updateProjectCompleted = async () => {
    await updateProjectComplete(
      {},
      {
        onSuccess(response: any) {
          if (response?.data?.result) {
            handleGetProjectAgain();
            openSnackbar({
              open: true,
              message: response?.data?.message,
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'alert',
              alert: {
                color: 'success'
              }
            } as SnackbarProps);
          } else if (Array.isArray(response?.data) && response?.data?.length > 0) {
            const errorMessages = response?.data?.map((err: any) => err.msg).join(', ');
            openSnackbar({
              open: true,
              message: errorMessages,
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'alert',
              alert: {
                color: 'error'
              }
            } as SnackbarProps);
          }
        },
        onError(error: any) {
          openSnackbar({
            open: true,
            message: error.message || 'An error occurred while creating the voucher.',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'error'
            }
          } as SnackbarProps);
        }
      }
    );
  };

  const [isCompleated, setIsCompleated] = useState(project!.is_active === false);

  return (
    <Grid item xs={12} md={12}>
      <MainCard
        title={
          <Stack mb={1}>
            <Typography variant="subtitle1">Update Project Complete</Typography>
          </Stack>
        }
        content={null}
        subheader={'This action won’t be reversable'}
        secondary={
          isUpdatingProjectStatus ? (
            <CircularProgress size={20} />
          ) : (
            <Switch
              disabled={!project!.is_active}
              edge="end"
              onChange={(e: React.ChangeEvent<HTMLInputElement>, checked) => {
                setIsCompleated(checked);
                if (checked) {
                  updateProjectCompleted();
                }
              }}
              color={project!.is_active ? 'primary' : 'success'}
              checked={isCompleated}
              inputProps={{
                'aria-labelledby': 'switch-list-label-oc'
              }}
            />
          )
        }
      ></MainCard>
    </Grid>
  );
}

export default ProjectStatusUpdate;
