/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useMemo } from 'react';

// material ui
// import { useTheme } from '@mui/material/styles';
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

// project imports
import AlertProjectDelete from '../AlertProjectDelete';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { openSnackbar } from 'api/snackbar';
import { insertProject, updateProject, useCreateProject, useGetProjectList } from 'api/project';

// assets

// types
import { SnackbarProps } from 'types/snackbar';
import { ProjectList } from 'types/project';
import { useGetEmployeeList, useGetFundingAgency } from 'api/voucher';
import { InitialValues, formateCreateProjectPayload, getvalidationSchema, initialValues } from './utils';
import { StepLabel, Stepper } from '@mui/material';
import { Step } from '@mui/material';
import Step1 from './Step1';
// import Step2 from './Step2';
import AnimateButton from 'components/@extended/AnimateButton';
// import Step3 from './Step3';
import Step4 from './Step4';

interface StatusProps {
  value: number;
  label: string;
}

// CONSTANT
const getInitialValues = (project: InitialValues | null) => {
  const newProject = initialValues;
  if (project) {
    return _.merge({}, initialValues, project);
  }

  return newProject;
};

// ==============================|| PROJECT ADD / EDIT - FORM ||============================== //
interface Props { 
  project: any | null; 
  closeModal: () => void; 
  getProjects: () => void 
}


export default function FormProjectAdd({ project, closeModal, getProjects }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const { employees } = useGetEmployeeList(true);
  const { fundingAgencies } = useGetFundingAgency();
  const steps = ['Basic Details', 'Attach Documents'];
  const [activeStep, setActiveStep] = useState(0);
  const { refetch } = useGetProjectList();


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
    initialValues: getInitialValues(project!),
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const formatedValues = await formateCreateProjectPayload(values as any); 
        if (formatedValues) {
          await createProject({
            ...formatedValues
          } as any);
          refetch();
          getProjects();
          setActiveStep(0);
          resetForm();
          closeModal();

        // Reload the page after submission
        // window.location.reload();
        }
      } catch (error: any) {
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
    }
  });

  const { createProject, isLoading: isCreatingVoucher } = useCreateProject(
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
        setActiveStep(0);
        formik.resetForm();
        handleAlertClose();
      } else if (Array.isArray(response) && response.length > 0) {
        // Handling validation errors
        const errorMessages = response.map((err) => err.msg).join(', ');
        openSnackbar({
          open: true,
          message: errorMessages,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'error'
          }
        } as SnackbarProps);
        setActiveStep(0);
        formik.resetForm();
      }
    },
    (error: any) => {
      // Error handling from the second callback
      openSnackbar({
        open: true,
        message: error.message || 'An error occurred while creating the voucher.',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'error'
        }
      } as SnackbarProps);
    }
  );

  const { handleSubmit, validateForm, setFieldTouched, values } = formik;
  const isDraft = values?.isDraft;

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
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <Button size="medium" variant="outlined" onClick={handleAlertClose} sx={{ mx: 3, ml: 1 }}>
              {'Close'}
            </Button>
          </Stack>
          <Divider />
          <DialogContent sx={{ p: 5, minHeight: 'calc(100vh - 50vh)' }}>
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
            {activeStep === 0 && <Step1 employees={employees} fundingAgencies={fundingAgencies} />}
            {/* {activeStep === 1 && <Step2 />} */}
            {/* {activeStep === 2 && <Step3 employees={employees} />} */}
            {activeStep === 1 && <Step4 />}
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
                  {activeStep === steps.length - 1 ? (isDraft ? 'Save Draft' : project ? 'Update' : 'Create') : 'Next'}
                </Button>
              </AnimateButton>
            </Stack>
          </DialogActions>
        </Form>
      </FormikProvider>
      {project && <AlertProjectDelete id={project.id!} title={project.project_code} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
}


