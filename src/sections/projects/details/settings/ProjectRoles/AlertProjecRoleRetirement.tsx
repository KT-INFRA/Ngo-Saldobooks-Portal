// material-ui
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';

import { openSnackbar } from 'api/snackbar';

// assets

// types
import { SnackbarProps } from 'types/snackbar';
import { useUpdateProjectRole } from 'api/project';
import LoadingButton from 'components/@extended/LoadingButton';
import { memo } from 'react';
import { useProjectRoleContext } from './util';
import { Chip } from '@mui/material';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const accessBadge: { [key: number]: 'primary' | 'info' | 'warning' } = {
  1: 'primary',
  2: 'info',
  3: 'warning'
} as const;

// ==============================|| CUSTOMER - DELETE ||============================== //

function AlertProjecRoleRetirement({ open, handleClose }: Props) {
  const { getProjectRoles, selectedRole } = useProjectRoleContext()!;
  const { retireProjectRole, isLoading } = useUpdateProjectRole({
    id: selectedRole?.id!,
    project_id: selectedRole?.project_id!,
    access_type_id: selectedRole?.access_type_id!,
    employee_id: selectedRole?.employee_id!
  });

  const handleDeleteProjectRole = async () => {
    await retireProjectRole(null, {
      onSuccess(response) {
        handleClose();
        getProjectRoles();
        openSnackbar({
          open: true,
          message: response?.data?.message,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          }
        } as SnackbarProps);
      },
      onError(error) {
        var errorMessage = error.message;
        if (Array.isArray(error)) {
          errorMessage = error[0].msg;
        } else {
          errorMessage = 'An error occurred while updating the project.';
        }
        openSnackbar({
          open: true,
          message: errorMessage,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'error'
          }
        } as SnackbarProps);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="sm"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 2, minWidth: 500 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Stack spacing={2}>
            <Typography variant="h5" align="center">
              {`Are you sure you want to remove`}
            </Typography>
            <Stack direction={'column'} gap={1}>
              <Typography textAlign={'center'} variant="h4" color={'primary'}>
                {`${selectedRole?.prefix + ' ' + selectedRole?.first_name + ' ' + selectedRole?.last_name}`}
              </Typography>
              <Stack direction={'row'} gap={1}>
                <Typography color={'secondary.main'} textAlign={'center'} variant="body1">
                  {`As `}
                  <Chip
                    size="small"
                    variant="combined"
                    color={accessBadge[selectedRole?.access_type_id as number]}
                    label={selectedRole?.access_type}
                  ></Chip>{' '}
                </Typography>

                <Typography color={'secondary.main'} textAlign={'center'} variant="body1">
                  {` from this project`}{' '}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <LoadingButton loading={isLoading} fullWidth color="primary" variant="contained" onClick={handleDeleteProjectRole} autoFocus>
              Confirm
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AlertProjecRoleRetirement);
