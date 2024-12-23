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
import { useInsertProjectGroup } from 'api/masters';
// types
import { SnackbarProps } from 'types/snackbar';
import { ProjectGroup } from 'types/masters';
import { InitialFormValues, getvalidationSchema, initialValues, formateVendorPayload } from './utils';
import Step1 from './Step1';
import AnimateButton from 'components/@extended/AnimateButton';

// CONSTANT
const getInitialValues = (projectGroup: InitialFormValues | null) => {
  const newVendor = initialValues;
  if (projectGroup) {
    return _.merge({}, initialValues, projectGroup);
  }
  return newVendor;
};

// ==============================|| PROJECT GROUP ADD / EDIT - FORM ||============================== //

export default function FormVendorAdd({
  projectGroup,
  closeModal,
  projectGroupRefetch
}: {
  projectGroup: any | null;
  closeModal: () => void;
  projectGroupRefetch: any;
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
    initialValues: getInitialValues(projectGroup!),
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newVendor: ProjectGroup | any = values;
        const formatedValues = await formateVendorPayload(newVendor as any);
        // values?.id ? await updateVendor({ ...formatedValues, id: values.id } as any) : await insertProjectGroup(formatedValues as any);
        await insertProjectGroup(formatedValues as any);
      } catch (error) {}
    }
  });

  const { insertProjectGroup, isLoading: isCreatingVoucher } = useInsertProjectGroup(
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
        projectGroupRefetch();
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
  // const { updateVendor, isLoading: isUpdatingVoucher } = useUpdateVendor(
  //   (response: any) => {
  //     if (response?.result) {
  //       openSnackbar({
  //         open: true,
  //         message: response.message,
  //         anchorOrigin: { vertical: 'top', horizontal: 'right' },
  //         variant: 'alert',
  //         alert: {
  //           color: 'success'
  //         }
  //       } as SnackbarProps);
  //       handleAlertClose();
  //       vendorRefetch();
  //     }
  //   },
  //   (error: any) => {
  //     openSnackbar({
  //       open: true,
  //       message: error[0].msg || 'An error occurred while creating the voucher.',
  //       anchorOrigin: { vertical: 'top', horizontal: 'right' },
  //       variant: 'alert',
  //       alert: {
  //         color: 'error'
  //       }
  //     } as SnackbarProps);
  //   }
  // );
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
          <DialogTitle>{projectGroup ? 'Edit ProjectGroup' : 'Add ProjectGroup'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 5 }}>
            <Step1 />
          </DialogContent>
          <Divider />
          <DialogActions sx={{ px: 2 }}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" onClick={() => handleSubmit()} sx={{ my: 3, ml: 1 }}>
                  {projectGroup ? 'Update' : 'Create'}
                </Button>
              </AnimateButton>
            </Stack>
          </DialogActions>
        </Form>
      </FormikProvider>
    </>
  );
}
