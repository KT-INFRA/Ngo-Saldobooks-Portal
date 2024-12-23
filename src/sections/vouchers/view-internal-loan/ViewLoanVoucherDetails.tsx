// material-ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';

// assets

// types
import { Box, DialogActions, DialogTitle, Typography } from '@mui/material';
import { Button } from '@mui/material';
import FromToCard from './FromToCard';
import { useViewInternalLoanContext } from 'pages/vouchers/view-internal-loan/view-internal-loan-context';
import DetailTable from './DetailTable';
interface ViewLoanVoucherDetailsProps {
  isLoading?: boolean;
  open: boolean;
  handleClose?: () => void;
}

export default function ViewLoanVoucherDetails({ open, handleClose }: ViewLoanVoucherDetailsProps) {
  const { selectedLoan } = useViewInternalLoanContext()!;
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        TransitionComponent={PopupTransition}
        maxWidth="md"
        // fullWidth
        aria-labelledby="column-delete-title"
        aria-describedby="column-delete-description"
      >
        <DialogTitle>
          <Typography variant="h5" color={'primary'}>
            {selectedLoan?.number}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <FromToCard />
          <Box sx={{ mt: 3 }}>
            <DetailTable />
          </Box>
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
