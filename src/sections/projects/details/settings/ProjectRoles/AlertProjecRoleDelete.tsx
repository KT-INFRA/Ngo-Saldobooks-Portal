// material-ui
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

import { openSnackbar } from 'api/snackbar';

// assets
import { Trash } from 'iconsax-react';

// types
import { SnackbarProps } from 'types/snackbar';
import { useDeleteProjectRole } from 'api/project';
import LoadingButton from 'components/@extended/LoadingButton';
import { memo } from 'react';
import { useProjectRoleContext } from './util';

interface Props {
  id: number;
  title?: string;
  open: boolean;
  handleClose: () => void;
}

// ==============================|| CUSTOMER - DELETE ||============================== //

function AlertProjecRoleDelete({ id, title, open, handleClose }: Props) {
  const { getProjectRoles } = useProjectRoleContext()!;
  const { deleteProjectRole, isLoading } = useDeleteProjectRole(id);

  const handleDeleteProjectRole = async () => {
    if (id) {
      await deleteProjectRole(null, {
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
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash variant="Bold" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete?
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <LoadingButton loading={isLoading} fullWidth color="error" variant="contained" onClick={handleDeleteProjectRole} autoFocus>
              Delete
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AlertProjecRoleDelete);
