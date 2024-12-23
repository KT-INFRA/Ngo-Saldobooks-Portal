/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useMemo } from 'react';

// material ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// third party
import _ from 'lodash';
import { useFormik, Form, FormikProvider } from 'formik';

// employee imports
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { openSnackbar } from 'api/snackbar';
import { useInsertTax } from 'api/masters';
// types
import { SnackbarProps } from 'types/snackbar';
import { TaxPayload } from 'types/masters';
import { InitialFormValues, getvalidationSchema, initialValues, formateTaxPayload } from './utils';
import Step1 from './Step1';
import AnimateButton from 'components/@extended/AnimateButton';

// CONSTANT
const getInitialValues = (tax: InitialFormValues | null) => {
  const newTax = initialValues;
  if (tax) {
    return _.merge({}, initialValues, tax);
  }
  return newTax;
};

// ==============================|| PROJECT GROUP ADD / EDIT - FORM ||============================== //

export default function FormTaxAdd({
  tax,
  closeModal,
  TaxRefetch,
  selectedTax
}: {
  tax: any | null;
  closeModal: () => void;
  TaxRefetch: any;
  selectedTax: string;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const validationSchema = useMemo(() => getvalidationSchema(0), []);
  const formik = useFormik({
    initialValues: getInitialValues(tax!),
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newTax: TaxPayload | any = values;
        const formatedValues = await formateTaxPayload(newTax as any);
        // values?.id ? await updateVendor({ ...formatedValues, id: values.id } as any) : await insertProjectGroup(formatedValues as any);
        await insertTax(formatedValues as any);
      } catch (error) {}
    }
  });

  const { insertTax, isLoading: isCreatingVoucher } = useInsertTax(
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
        handleAlertClose();
        TaxRefetch();
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
  const { handleSubmit } = formik;

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
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{tax ? 'Edit Tax' : 'Add Tax'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 5 }}>
            <Step1 selectedTax={selectedTax} />
          </DialogContent>
          <Divider />
          <DialogActions sx={{ px: 2 }}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" onClick={() => handleSubmit()} sx={{ my: 3, ml: 1 }}>
                  {tax ? 'Update' : 'Create'}
                </Button>
              </AnimateButton>
            </Stack>
          </DialogActions>
        </Form>
      </FormikProvider>
    </>
  );
}
