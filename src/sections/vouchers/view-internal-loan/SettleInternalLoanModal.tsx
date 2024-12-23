// material-ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';
import * as Yup from 'yup';

// assets

// types
import { DialogActions, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { DialogTitle } from '@mui/material';
import FromToCard from './FromToCard';
import SettleLoanForm from './SettleLoanForm';
import { FormikHelpers, FormikProvider, useFormik } from 'formik';
import { useSettleInternalLoan } from 'api/voucher';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { useViewInternalLoanContext } from 'pages/vouchers/view-internal-loan/view-internal-loan-context';
import { useEffect } from 'react';
interface ViewLoanVoucherDetailsProps {
  isLoading?: boolean;
  open: boolean;
  handleClose?: () => void;
}

export interface ISettleInitialValuesProps {
  amount: string;
  loanAmount: number;
  letterRefNo: string;
  narration: string;
}

const validationSchema = Yup.object().shape({
  loanAmount: Yup.number(),
  amount: Yup.number()
    .required('Amount required')
    .min(1, 'Amount must be greater than 0')
    .test('amount', `Amount can't be more than the loan amount`, function (value) {
      const { loanAmount } = this.parent;
      return value <= loanAmount;
    }),
  letterReferenceNo: Yup.string(),
  narration: Yup.string()
});

export default function SettleInternalLoanModal({ open, handleClose }: ViewLoanVoucherDetailsProps) {
  const { selectedLoan } = useViewInternalLoanContext()!;
  const formik = useFormik<ISettleInitialValuesProps>({
    initialValues: {
      amount: '',
      loanAmount: 0,
      letterRefNo: '',
      narration: ''
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    onSubmit: handleSettleInternalLoan
  });

  useEffect(() => {
    formik.setFieldValue('loanAmount', selectedLoan?.loan_amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleSettleInternalLoan(values: ISettleInitialValuesProps, { resetForm }: FormikHelpers<ISettleInitialValuesProps>) {
    const payload = {
      project_id: selectedLoan?.project_id,
      from_project_id: selectedLoan?.from_project_id,
      letter_ref_no: values?.letterRefNo,
      narration: '',
      amount: values.amount,
      paid: true
    };

    await settleInternalLoan(payload, {
      onSuccess(response) {
        if (response?.data?.result) {
          // Success response
          openSnackbar({
            open: true,
            message: response?.data?.message,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            }
          } as SnackbarProps);
          resetForm();
        } else if (Array.isArray(response?.data) && response?.data?.length > 0) {
          // Handling validation errors
          const errorMessages = response?.data?.map((err) => err.msg).join(', ');
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

  const { isLoading: isSettleLoading, settleInternalLoan } = useSettleInternalLoan();

  return (
    <FormikProvider value={formik}>
      <Dialog
        open={open}
        onClose={() => {
          formik?.resetForm();
          if (handleClose) {
            handleClose();
          }
        }}
        TransitionComponent={PopupTransition}
        fullWidth
        aria-labelledby="column-delete-title"
        aria-describedby="column-delete-description"
      >
        <DialogTitle>
          <Typography variant="h5" color={'primary'}>
            Settle Loan
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <FromToCard />

          <SettleLoanForm isLoading={isSettleLoading} handleSubmit={() => formik.handleSubmit()} />
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              formik?.resetForm();
              if (handleClose) {
                handleClose();
              }
            }}
          >
            close
          </Button>
          {/* <Button color="primary" variant="contained" onClick={() => handleClose()}>
            Download
          </Button> */}
        </DialogActions>
      </Dialog>
    </FormikProvider>
  );
}
