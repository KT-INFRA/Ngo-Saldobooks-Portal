/* eslint-disable @typescript-eslint/no-unused-vars */
// material-ui
import {
  AccordionDetails,
  Box,
  Button,
  CardActions,
  Grid,
  InputLabel,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material';
import { Accordion } from '@mui/material';
import { AccordionSummary } from '@mui/material';
import { Stack, useTheme } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import IconButton from 'components/@extended/IconButton';
import * as XLSX from 'xlsx';
// project-imports
import MainCard from 'components/MainCard';
import { useFormik } from 'formik';
import { ArrowDown, ArrowUp, DocumentText, DocumentUpload, Setting5 } from 'iconsax-react';
import { Suspense, SyntheticEvent, useState } from 'react';
import { useDropzone } from 'react-dropzone';
// import PayslipTable from 'sections/payslips/payslip-upload/payslip-table';
import dayjs from 'dayjs';
import { useUploadPayBill, useValidatePayBill } from 'api/payroll';
import { convertFileToBase64 } from 'sections/payslips/payslip-upload/utils';
import UploadPaySlipAlert from 'sections/payslips/UploadPaySlipAlert';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { Tabs } from '@mui/material';
import { Tab } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export default function UploadPayslip() {
  const theme = useTheme();
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { values, handleChange, touched, errors, setFieldValue } = useFormik<any>({
    initialValues: {
      voucherDate: dayjs().format('YYYY-MM-DD'),
      voucher: 0,
      description: '',
      activeStep: 1,
      isValidated: false,
      file: null
    },
    onSubmit: (values) => {}
  });

  const { mutateAsync: validateFile, isPending } = useValidatePayBill();
  const { mutateAsync: uploadFile, isPending: isUploding } = useUploadPayBill();

  const [showData, setShowData] = useState(false);
  const [paySlipsData, setPayslipsData] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);

  const extractExcelData = (acceptedFiles: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event?.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        blankrows: false
      });
      setPayslipsData(jsonData as any);
    };
    reader.readAsArrayBuffer(acceptedFiles);
  };
  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setFieldValue('activeTab', newValue);
  };

  const handleClose = () => {
    setOpenUpload(false);
    setFieldValue('file', null);
  };

  const handleValidateFile = async () => {
    const base64 = await convertFileToBase64(values.file);
    await validateFile(
      { payroll_file: base64, business_id: 1, date: dayjs(values.voucherDate).format('YYYY-MM-DD') },
      {
        onError: (error) => {
          setError(error?.message);
          setFieldValue('isValidated', false);
          openSnackbar({
            open: true,
            message: error?.message,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'error'
            }
          } as SnackbarProps);
        },
        onSuccess: ({ data }) => {
          setFieldValue('isValidated', true);
          openSnackbar({
            open: true,
            message: data?.message,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            }
          } as SnackbarProps);
          // setShowData(true);
          // setPayslipsData(data);
        }
      }
    );
  };
  const handleUploadFile = async () => {
    const base64 = await convertFileToBase64(values.file);
    await uploadFile(
      {
        payroll_file: base64,
        description: values.description,
        business_id: 1,
        created_by: 1,
        date: dayjs(values.voucherDate).format('YYYY-MM-DD')
      },
      {
        onError: (error) => {
          setError(error?.message);
          openSnackbar({
            open: true,
            message: error?.message,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'error'
            }
          } as SnackbarProps);
        },
        onSuccess: ({ data }) => {
          handleClose();
          openSnackbar({
            open: true,
            message: 'PayRollExcel data and EmployeePayRollDetails saved successfully.',
            // message: data?.message,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            }
          } as SnackbarProps);
        }
      }
    );
  };

  const steps = ['Upload', 'Generate'];
  return (
    <>
      <Stack>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs
            value={values.activeStep}
            onChange={handleChangeTab}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="account profile tab"
          >
            <Tab label="Upload" icon={<DocumentUpload />} iconPosition="start" />
            <Tab label="Generate" icon={<DocumentText />} iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          <Suspense>
            <Typography>hi</Typography>
            {/* <Component breadcrumbs={breadcrumbs} addBreadcrumb={addBreadcrumb} isLoading={loading} project={project} /> */}
          </Suspense>
        </Box>
        <Stepper activeStep={values.activeStep} orientation="vertical">
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
              <StepContent>
                <MainCard border={false} shadow={theme.customShadows.z1} sx={{ height: '100%' }}>
                  <Accordion
                    style={{
                      borderWidth: 0,
                      backgroundColor: 'transparent'
                    }}
                    expanded={showData}
                  >
                    <AccordionSummary
                      style={{
                        backgroundColor: 'transparent',
                        padding: 0,
                        borderWidth: 0
                      }}
                      expandIcon={null}
                    >
                      <Grid container gap={3}>
                        <Grid item xs={12} md={3} xl={3}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <InputLabel sx={{ mb: 1 }}>{'Date'}</InputLabel>
                            <Stack>
                              <MobileDatePicker
                                views={['month', 'year']}
                                format={'MM/yyyy'}
                                value={new Date(values.voucherDate)}
                                onChange={(date) => {
                                  setFieldValue('voucherDate', dayjs(date).format('YYYY-MM-DD'));
                                }}
                              />
                            </Stack>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6} xl={6}>
                          <InputLabel sx={{ mb: 1 }}>{'Description'}</InputLabel>
                          <TextField id="description" fullWidth variant="outlined" placeholder="Description" defaultValue="" />
                        </Grid>
                        <Grid item xs={12} md={2} xl={2}>
                          <InputLabel sx={{ mb: 1 }}>{'Upload Excel'}</InputLabel>
                          <Stack direction={'row'} gap={1}>
                            {/* <Box {...getRootProps()}>
                              <input {...getInputProps()} accept="application/vnd.ms-excel" />
                              <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                size="large"
                                color={'primary'}
                                tabIndex={-1}
                                startIcon={<DocumentUpload />}
                              >
                                {'Pick File'}
                              </Button>
                            </Box> */}
                            <Button
                              component="label"
                              role={undefined}
                              onClick={() => setOpenUpload(true)}
                              variant="contained"
                              size="large"
                              color={'primary'}
                              tabIndex={-1}
                              startIcon={<DocumentUpload />}
                            >
                              {'Pick File'}
                            </Button>
                            {/* <IconButton
                              onClick={() => setShowData(!showData)}
                              size="large"
                              variant="text"
                              shape="square"
                              aria-label="upload picture"
                            >
                              {showData ? <ArrowUp /> : <ArrowDown />}
                            </IconButton> */}
                          </Stack>
                        </Grid>
                      </Grid>
                    </AccordionSummary>

                    <AccordionDetails>{/* <PayslipTable paySlipsData={paySlipsData} /> */}</AccordionDetails>
                  </Accordion>
                  {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button onClick={handleValidateFile} variant="contained" color="primary">
                      {isPending ? 'Validating' : 'Save'}
                    </Button>
                    <Button variant="outlined" color="secondary">
                      Cancel
                    </Button>
                  </CardActions> */}
                </MainCard>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        <UploadPaySlipAlert
          file={values.file}
          setFieldValue={setFieldValue}
          handleValidateFile={handleValidateFile}
          handleUploadFile={handleUploadFile}
          isValidated={values.isValidated}
          error={error}
          isLoading={isPending || isUploding}
          open={openUpload}
          handleClose={handleClose}
        />
      </Stack>
    </>
  );
}
