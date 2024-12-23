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
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { openSnackbar } from 'api/snackbar';
import { useInsertEmployee } from 'api/masters';
// types
import { SnackbarProps } from 'types/snackbar';
import { EmployeeList } from 'types/masters';
import { InitialFormValues, getvalidationSchema, initialValues, formateEmployeePayload } from './utils';
import { StepLabel, Stepper } from '@mui/material';
import { Step } from '@mui/material';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import AnimateButton from 'components/@extended/AnimateButton';

interface StatusProps {
  value: number;
  label: string;
}

// CONSTANT
const getInitialValues = (employee: InitialFormValues | null) => {
  const newEmployee = initialValues;
  if (employee) {
    return _.merge({}, initialValues, employee);
  }

  return newEmployee;
};

// ==============================|| EMPLOYEE ADD / EDIT - FORM ||============================== //

export default function FormEmployeeAdd({
  employee,
  closeModal,
  employeeRefetch
}: {
  employee: any | null;
  closeModal: () => void;
  employeeRefetch: any;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const steps = ['Personal Details', 'Office Details', 'Payroll Details', 'Payment Details'];
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
    initialValues: getInitialValues(employee!),
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newEmployee: EmployeeList | any = values;
        newEmployee.name = newEmployee.firstName + ' ' + newEmployee.lastName;
        const formatedValues = await formateEmployeePayload(values as any);
        await insertEmployee(formatedValues as any);
      } catch (error) {}
    }
  });

  const { insertEmployee, isLoading: isCreatingVoucher } = useInsertEmployee(
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
        employeeRefetch();
      } else {
        openSnackbar({
          open: true,
          message: response.message,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'error'
          }
        } as SnackbarProps);
      }
    },
    (error: any) => {
      openSnackbar({
        open: true,
        // message: error[0].msg || 'An error occurred while creating the voucher.',
        message: error.message || 'An error occurred while creating the Employee.',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'error'
        }
      } as SnackbarProps);
    }
  );
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
          <DialogTitle>{employee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
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
            {activeStep === 1 && <Step2 />}
            {activeStep === 2 && <Step3 />}
            {activeStep === 3 && <Step4 />}
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
                  {activeStep === steps.length - 1 ? (employee ? 'Update' : 'Create') : 'Next'}
                </Button>
              </AnimateButton>
            </Stack>
          </DialogActions>
        </Form>
      </FormikProvider>
    </>
  );
}
