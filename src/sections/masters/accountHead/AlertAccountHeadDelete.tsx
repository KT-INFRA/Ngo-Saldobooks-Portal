// material-ui
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

import { useDeleteAccountHead } from 'api/masters';
import { openSnackbar } from 'api/snackbar';

// assets
import { Trash } from 'iconsax-react';

// types
import { SnackbarProps } from 'types/snackbar';

interface Props {
  id: number;
  title: string;
  open: boolean;
  handleClose: () => void;
  accountHeadRefetch: any;
}

// ==============================|| VENDOR - DELETE ||============================== //

export default function AlertAccountHeadDelete({ id, title, open, handleClose, accountHeadRefetch }: Props) {
  const { deleteAccountHead, accountHeadDeleteError, accountHeadDelete } = useDeleteAccountHead({ id });
  const deletehandler = async () => {
    try {
      await deleteAccountHead();

      if (accountHeadDeleteError && Array.isArray(accountHeadDeleteError)) {
        const errorMsg = accountHeadDeleteError[0]?.msg || 'Failed to delete Account Head';
        // alert('inside error');
        openSnackbar({
          open: true,
          message: errorMsg,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'error'
          }
        } as SnackbarProps);
      } else {
        // alert('inside success');

        const successMessage = accountHeadDelete?.data || 'Account Head Deleted successfully';

        openSnackbar({
          open: true,
          message: successMessage,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          }
        } as SnackbarProps);
        handleClose();
        accountHeadRefetch();
      }
    } catch (error: any) {
      const [{ msg }] = error as any[];
      openSnackbar({
        open: true,
        message: msg,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'error'
        }
      } as SnackbarProps);
      handleClose();
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
            <Button fullWidth color="error" variant="contained" onClick={deletehandler} autoFocus>
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
