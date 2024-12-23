/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import storage from 'utils/storage';
import { UserProfile } from 'types/auth';
// material ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { openSnackbar } from 'api/snackbar';
import { useInsertCreditVoucherConfirmation } from 'api/voucher';
// assets

// types
import { SnackbarProps } from 'types/snackbar';
import { ProjectList } from 'types/project';
import InputAdornment from '@mui/material/InputAdornment';
import InputMask from 'react-input-mask';

interface voucherconfirmation {
  payment_type_id: string;
  ref_number: string;
  voucher_no: string;
  voucherDate: string;
}

interface StatusProps {
  value: number;
  label: string;
}

// CONSTANT
const initialValues: voucherconfirmation = {
  payment_type_id: '',
  ref_number: '',
  voucher_no: '',
  voucherDate: dayjs().format('YYYY-MM-DD')
};

const allStatus: StatusProps[] = [
  { value: 3, label: 'Rejected' },
  { value: 1, label: 'Verified' },
  { value: 2, label: 'Pending' }
];
const { user_id, business_id }: UserProfile = storage.getItem('user');
// ==============================|| PROJECT ADD / EDIT - FORM ||============================== //

export default function FormVoucherConfirm({
  voucher,
  voucherData,
  closeModal,
  voucherUpdate,
  paymentTypes,
  submit
}: {
  voucher: number | null;
  voucherData: any;
  closeModal: () => void;
  voucherUpdate: any;
  paymentTypes: any;
  submit: any;
}) {
  // const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  var ProjectSchema;
  if (voucherData?.voucher_type_id === 1 && voucherData?.voucher_category_id === 5) {
    ProjectSchema = Yup.object().shape({
      payment_type_id: Yup.number().required('Payment Type is required'),
      ref_number: Yup.string().required('Receipt No & Date is required'),
      voucher_no: Yup.string().required('Voucher Number is required'),
      voucherDate: Yup.string().required('Voucher Date is required').default(dayjs().format('YYYY-MM-DD'))
    });
  } else {
    ProjectSchema = Yup.object().shape({
      payment_type_id: Yup.number().required('Payment Type is required'),
      ref_number: Yup.string(),
      voucher_no: Yup.string().required('Voucher Number is required'),
      voucherDate: Yup.string().required('Voucher Date is required').default(dayjs().format('YYYY-MM-DD'))
    });
  }
  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const { creditVoucherConfirm, isLoading: isCreatingVoucher } = useInsertCreditVoucherConfirmation(
    (response: any) => {
      if (response?.result) {
        // Success response
        openSnackbar({
          open: true,
          message: response.message,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          }
        } as SnackbarProps);
        handleAlertClose();
        voucherUpdate(0);
        submit(); //FOR REFETCH
      }
    },
    (error: any) => {
      openSnackbar({
        open: true,
        message: error[0].msg || 'An error occurred while creating the voucher.',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'error'
        }
      } as SnackbarProps);
    }
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: ProjectSchema,
    enableReinitialize: true,
    //onSubmit: async (values, { setSubmitting }) => {
    onSubmit: async (values) => {
      try {
        let voucherConfirmationDate: ProjectList | any = values;
        const { payment_type_id: payment_type_id_raw, ref_number, voucher_no: number, voucherDate: date } = voucherConfirmationDate;
        const payment_type_id = Number(payment_type_id_raw);
        let finalVoucherConfirmationData = {
          business_id: business_id,
          modified_by: user_id,
          receiver_type_id: voucherData?.receiver_type_id,
          id: voucher,
          payment_type_id,
          ref_number,
          number: values.voucher_no + '/' + dayjs(values?.voucherDate).format('MM'),
          date
        };
        // alert(JSON.stringify(finalVoucherConfirmationData));
        // return false;
        await creditVoucherConfirm(finalVoucherConfirmationData as any);
      } catch (error) {
        // console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values, handleChange, handleBlur } = formik;
  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{'Confirm Voucher'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="payment_type_id">Payment Type</InputLabel>
                        <Select
                          displayEmpty
                          placeholder="Select Payment Type"
                          name="payment_type_id"
                          value={values.payment_type_id}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        >
                          <MenuItem disabled value="0">
                            Select Payment Type
                          </MenuItem>
                          {[...paymentTypes].map((paymentType) => (
                            <MenuItem value={paymentType.value}>{paymentType.label}</MenuItem>
                          ))}
                        </Select>
                        {touched.payment_type_id && Boolean(errors.payment_type_id) && (
                          <FormHelperText error={Boolean(errors.payment_type_id)}>{errors.payment_type_id}</FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        {voucherData?.voucher_type_id === 1 && voucherData?.voucher_category_id === 5 ? (
                          <InputLabel htmlFor="ref_number">Receipt No & Date</InputLabel>
                        ) : (
                          <InputLabel htmlFor="ref_number">Payment Reference Number</InputLabel>
                        )}

                        <TextField
                          fullWidth
                          id="ref_number"
                          placeholder="Enter Payment Reference Number"
                          {...getFieldProps('ref_number')}
                          error={Boolean(touched.ref_number && errors.ref_number)}
                          helperText={touched.ref_number && errors.ref_number}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <InputLabel sx={{ mb: 1 }}>{'Voucher Date'}</InputLabel>
                        <Stack>
                          <MobileDatePicker
                            format={'dd/MM/yyyy'}
                            value={new Date(values.voucherDate)}
                            onChange={(date) => {
                              setFieldValue('voucherDate', dayjs(date).format('YYYY-MM-DD'));
                            }}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel sx={{ mb: 1 }}>{'Voucher Number'}</InputLabel>
                      <InputMask
                        mask={`999`} // Mask for 3 digits; adjust as needed
                        value={values.voucher_no}
                        maskChar="0"
                        alwaysShowMask={false}
                        disabled={false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {(inputProps: { onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
                          return (
                            <TextField
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">Month - {dayjs(values.voucherDate).format('MM')}</InputAdornment>
                                )
                              }}
                              id="voucher_no"
                              name="voucher_no"
                              placeholder={`XXX`} // Placeholder for voucher number
                              value={values.voucher_no}
                              error={touched.voucher_no && Boolean(errors.voucher_no)}
                              helperText={touched.voucher_no && errors.voucher_no}
                              fullWidth
                              {...inputProps} // Spread inputProps for masking functionality
                            />
                          );
                        }}
                      </InputMask>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item></Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      Confirm Voucher
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
}
