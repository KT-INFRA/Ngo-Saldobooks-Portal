// material-ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';
import * as Yup from 'yup';

// assets

// types
import { Chip, DialogActions, Divider, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { FormikHelpers, FormikProvider, useFormik } from 'formik';
import { useSettleAdvanceManagement } from 'api/voucher';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { useViewAdvanceContext } from 'pages/vouchers/view-advance/view-advance-context';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import SettleTable from './SettleLoan/SettleTable';
import LoadingButton from 'components/@extended/LoadingButton';
import { useMemo } from 'react';
interface SettleAdvanceProps {
  isLoading?: boolean;
  open: boolean;
  handleClose?: () => void;
}
export interface SettleAdvanceItemProps {
  account_head_id: number;
  amount: number;
  employee_id: number;
  id: string;
  isNew: true;
}

export interface ISettleInitialValuesProps {
  items: SettleAdvanceItemProps[];
  narration: string;
}

const validationSchema = Yup.object().shape({
  narration: Yup.string(),
  items: Yup.array().of(
    Yup.object().shape({
      account_head_id: Yup.number().required('Required').min(1, 'Please Select Account Head'),
      amount: Yup.number().required('Required').min(1, 'Amount must be greater than 0')
    })
  )
});

export default function SettleInternalLoanModal({ open, handleClose }: SettleAdvanceProps) {
  const { selectedAdvance, advanceDetail, handleGetAdvanceList } = useViewAdvanceContext()!;
  const formik = useFormik<ISettleInitialValuesProps>({
    initialValues: {
      items: [],
      narration: ''
    },
    validationSchema: validationSchema,
    validateOnMount: false,
    onSubmit: handleSettleInternalLoan
  });

  const { settleAdvanceManagement, isLoading: isSettleAdvance } = useSettleAdvanceManagement();

  async function handleSettleInternalLoan(values: ISettleInitialValuesProps, { resetForm }: FormikHelpers<ISettleInitialValuesProps>) {
    const payload = {
      project_id: advanceDetail?.project_id,
      advance_voucher_id: advanceDetail?.id,
      journal_items: {
        narration: values?.narration,
        items: values.items.map((item, index) => ({
          account_head_id: item.account_head_id,
          amount: item.amount,
          voucher_employee_id: item.employee_id,
          ordinal: index + 1
        }))
      }
    };
    await settleAdvanceManagement(payload, {
      onSuccess(response) {
        if (response?.data?.result) {
          handleGetAdvanceList();
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
          if (handleClose) {
            handleClose();
          }
        } else if (Array.isArray(response?.data) && response?.data?.length > 0) {
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

  const hasNewItem = useMemo(() => {
    return (formik?.values?.items ?? []).some((item) => item.isNew);
  }, [formik?.values?.items]);

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
        keepMounted
        TransitionComponent={PopupTransition}
        maxWidth="md"
        fullWidth
        aria-labelledby="column-delete-title"
        aria-describedby="column-delete-description"
      >
        <DialogTitle>
          Settle Advance <Chip variant="combined" color="primary" size="small" label={selectedAdvance?.number}></Chip>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Stack direction="row" mt={1}>
            <Stack direction={'column'} gap={0.5} width={'100%'}>
              <Typography variant="subtitle1">Project Id: </Typography>
              <Typography>{selectedAdvance?.project_code}</Typography>
            </Stack>
            <Stack direction={'column'} gap={0.5} width={'100%'}>
              <Typography variant="subtitle1">Letter No / Ref No: </Typography>
              <Typography>{selectedAdvance?.letter_ref_no}</Typography>
            </Stack>
            <Stack direction={'column'} gap={0.5} width={'100%'}>
              <Typography variant="subtitle1">Narration </Typography>
              <TextField size="small" placeholder="Narration" {...formik?.getFieldProps('narration')} />
            </Stack>
          </Stack>
          <SettleTable />
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
          <LoadingButton
            color="primary"
            disabled={!hasNewItem}
            variant="contained"
            loading={isSettleAdvance}
            onClick={() => {
              formik?.handleSubmit();
            }}
          >
            Settle Advance
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormikProvider>
  );
}
