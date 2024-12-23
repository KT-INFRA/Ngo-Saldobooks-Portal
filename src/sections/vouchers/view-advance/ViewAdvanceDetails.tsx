// material-ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';

// assets

// types
import { Chip, DialogActions, Divider, Grid } from '@mui/material';
import { Button } from '@mui/material';
import { useViewAdvanceContext } from 'pages/vouchers/view-advance/view-advance-context';
import NarrationView from './NarrationView';
import DetailTable from './DetailTable';
import VouchersDocuments from './VouchersDocuments/VouchersDocuments';
interface ViewAdvanceDetailsProps {
  isLoading?: boolean;
  open: boolean;
  handleClose?: () => void;
}

export default function ViewAdvanceDetails({ open, handleClose }: ViewAdvanceDetailsProps) {
  const { advanceDetail } = useViewAdvanceContext()!;
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        TransitionComponent={PopupTransition}
        maxWidth="md"
        fullWidth
        aria-labelledby="column-delete-title"
        aria-describedby="column-delete-description"
      >
        <DialogContent>
          <Chip sx={{ marginBottom: 2 }} variant="combined" color="primary" size="small" label={advanceDetail?.number}></Chip>
          <Grid container>
            <NarrationView />
            <Grid item xs={12} md={12} mt={3}>
              <VouchersDocuments
                showPreviewVoucherAlert
                title={'Advance Voucher'}
                lists={advanceDetail?.advance_slip ? [advanceDetail?.advance_slip] : []}
              />
            </Grid>
            <Grid item xs={12} md={12} my={3}>
              <Divider sx={{ mb: 2 }} />
              <DetailTable />
              <Divider sx={{ my: 2 }} />
              <VouchersDocuments title={'Journal Vouchers'} lists={advanceDetail?.journal_slip || []} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="error" variant="outlined" onClick={handleClose}>
            close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
