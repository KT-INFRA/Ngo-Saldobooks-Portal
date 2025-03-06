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
import { useFormik, Form, FormikProvider, FormikTouched } from 'formik';

// employee imports
// import AlertVendorDelete from './AlertVendorDelete';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { openSnackbar } from 'api/snackbar';
//import { useInsertVendor, useUpdateVendor } from 'api/masters';
import { useInsertFundingAgency } from 'api/masters';
// types
import { SnackbarProps } from 'types/snackbar';
import { fundingAgencyPayload } from 'types/masters';
import { InitialFormValues, getvalidationSchema, initialValues, formateFundingAgencyPayload } from './utils';
import { StepLabel, Stepper } from '@mui/material';
import { Step } from '@mui/material';
import Step1 from './Step1';
// import Step2 from './Step2';
import AnimateButton from 'components/@extended/AnimateButton';

interface StatusProps {
  value: number;
  label: string;
}

// CONSTANT
const getInitialValues = (fundingAgency: InitialFormValues | null) => {
  const newFundingAgency = initialValues;
  if (fundingAgency) {
    return _.merge({}, initialValues, fundingAgency);
  }

  return newFundingAgency;
};

// ==============================|| VENDOR ADD / EDIT - FORM ||============================== //

export default function FormFundingAgencyAdd({
  fundingAgency,
  closeModal,
  fundingAgencyRefetch
}: {
  fundingAgency: any | null;
  closeModal: () => void;
  fundingAgencyRefetch: any;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const steps = ['Basic Details'];
  const [activeStep, setActiveStep] = useState(0);
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const validationSchema = useMemo(() => getvalidationSchema(activeStep), [activeStep]);
  const formik = useFormik({
    initialValues: getInitialValues(fundingAgency!),
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      alert("Hii");
      try {
        let newFundingAgency: fundingAgencyPayload | any = values;
        const formatedValues = await formateFundingAgencyPayload(newFundingAgency as any);
        // values?.id ? await updateVendor({ ...formatedValues, id: values.id } as any) : await insertVendor(formatedValues as any);
        await insertFundingAgency(formatedValues as any);
      } catch (error) {}
    }
  });

  const { insertFundingAgency, isLoading: isCreatingVoucher } = useInsertFundingAgency(
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
        fundingAgencyRefetch();
      }
    },
    (error: any) => {
      openSnackbar({
        open: true,
        message: error[0].msg || 'An error occurred while creating the FundingAgency.',
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
  //       fundingAgencyRefetch();
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
  const { handleSubmit, validateForm, setFieldTouched, errors } = formik;
  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  const handleNext = async () => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else {
      Object.keys(initialValues).forEach((key: string) => {
        setFieldTouched(key);
      });
    }
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{fundingAgency ? 'Edit FundingAgency' : 'Add FundingAgency'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 5 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((step, index) => (
                <Step key={step}>
                  <StepLabel
                    onClick={() => {
                      // setActiveStep(index);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    {step}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && <Step1 />}
            {/* {activeStep === 1 && <Step2 />} */}
          </DialogContent>
          <Divider />
          <DialogActions sx={{ px: 2 }}>
            <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'flex-end'}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
                  Back
                </Button>
              )}
              <AnimateButton>
                <Button variant="contained" onClick={handleNext} sx={{ my: 3, ml: 1 }}>
                  {activeStep === steps.length - 1 ? (fundingAgency ? 'Update' : 'Create') : 'Next'}
                </Button>
              </AnimateButton>
            </Stack>
          </DialogActions>
        </Form>
      </FormikProvider>
      {/* {employee && <AlertVendorDelete id={employee.id!} title={employee.employee_code} open={openAlert} handleClose={handleAlertClose} />} */}
    </>
  );
}
