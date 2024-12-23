// material-ui
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import dayjs from 'dayjs';
//import { useDeleteDebitVoucher } from 'api/voucher';
import { useApprovalDebitVoucher } from 'api/voucher';
import { openSnackbar } from 'api/snackbar';

// assets
import { Trash } from 'iconsax-react';
import storage from 'utils/storage';
import { UserProfile } from 'types/auth';
// types
import { SnackbarProps } from 'types/snackbar';

interface Props {
  id: number;
  title: string;
  open: boolean;
  handleClose: () => void;
  voucher_date?: string;
  voucher_number?: string;
  submit?: any;
}
const { user_id, business_id }: UserProfile = storage.getItem('user');

// ==============================|| PROJECT - DELETE ||============================== //

export default function AlertProjectApprove({ id, voucher_date, voucher_number, title, open, handleClose, submit }: Props) {
  const approveVoucherData = { business_id: business_id, user_id: user_id, voucher_id: id };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { approveDebitVoucher, isLoading: isApproveDebitVoucherLoading } = useApprovalDebitVoucher(
    (response: any) => {
      if (response?.result) {
        openSnackbar({
          open: true,
          message: response.message,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          }
        } as SnackbarProps);
        handleClose();
        submit();
      }
    },
    (error: any) => {
      openSnackbar({
        open: true,
        message: error[0].msg || 'An error occurred while cancel voucher.',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'error'
        }
      } as SnackbarProps);
    }
  );
  const deletehandler = async () => {
    //alert(JSON.stringify(dedeledVoucherData));
    await approveDebitVoucher(approveVoucherData);
  };
  // ----------------------------------------------

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
            <Typography align="center">
              Are you sure you want to Approve?
              <br />
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{voucher_number ? dayjs(voucher_number).format('DD-MM-YYYY') : ''} &nbsp;-&nbsp;{voucher_date}&quot;{' '}
              </Typography>
              {/* user, all task assigned to that user will also be deleted. */}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deletehandler} autoFocus>
              OK
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
