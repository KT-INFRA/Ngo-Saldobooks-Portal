import { useState, useMemo } from 'react';

import MainCard from 'components/MainCard';
import VoucherItem from './voucher-item';
import { openSnackbar } from 'api/snackbar';
import { useCreateDebitVoucher, useGetAccountHead, useGetGSTList, useGetOwnBankAccounts, useGetProjectList, useGetTDSList, useGetVendorList } from 'api/voucher';

import { FieldArray, Formik, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


import {
  Alert,
  Autocomplete,
  Box,
  FormControl,
  Select,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Divider,
  Button,
  CardActions,Dialog, DialogActions, DialogContent, DialogTitle,
  FormHelperText
} from '@mui/material';
import { Add } from 'iconsax-react';

// utils
import {
  firstStepValidationSchema,
  secondStepValidationSchema,
  initialValues,
  InitialValues,
  Item,
  getTaxData,
  formateCreateVoucherPayload
} from './utils';

import { SnackbarProps } from 'types/snackbar';
import VoucherCardTitle from '../../components/voucher-card-title';
import { ReactFilesPreview } from 'sections/projects/add-project/FilePicker/ReactFilesPreview';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';


// ==============================|| Account Voucher - ADD Voucher ||============================== //

export default function VendorVoucher(modalToggler: () => void) {
  const { projects } = useGetProjectList();
  // const { accountHeads } = useGetAccountHead(['D', 'B']);


  const { vendors } = useGetVendorList();
  const { gstLists } = useGetGSTList();
  const { tdsLists } = useGetTDSList();
  const { bankListData, loading } = useGetOwnBankAccounts();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isCreatingVoucher, setIsCreatingVoucher] = useState(false);


  // const { createVoucher, isLoading: isCreatingVoucher } = useCreateDebitVoucher(
  //   (response: any) => {
  //     if (response?.result) {
  //       // Success response
  //       openSnackbar({
  //         open: true,
  //         message: response.message,
  //         anchorOrigin: { vertical: 'top', horizontal: 'right' },
  //         variant: 'alert',
  //         alert: {
  //           color: 'success'
  //         }
  //       } as SnackbarProps);
  //     } else if (Array.isArray(response) && response.length > 0) {
  //       // Handling validation errors  const { bankListData, loading } = useGetOwnBankAccounts();

  //       const errorMessages = response.map((err) => err.msg).join(', ');
  //       openSnackbar({
  //         open: true,
  //         message: errorMessages,
  //         anchorOrigin: { vertical: 'top', horizontal: 'right' },
  //         variant: 'alert',
  //         alert: {
  //           color: 'error'
  //         }
  //       } as SnackbarProps);
  //     }
  //   },
  //   (error: any) => {
  //     var errorMessage = error.message;
  //     if (Array.isArray(error)) {
  //       errorMessage = error[0].msg;
  //     } else {
  //       errorMessage = 'An error occurred while updating the project.';
  //     }
  //     openSnackbar({
  //       open: true,
  //       message: errorMessage,
  //       anchorOrigin: { vertical: 'top', horizontal: 'right' },
  //       variant: 'alert',
  //       alert: {
  //         color: 'error'
  //       }
  //     } as SnackbarProps);
  //   }
  // );
 
  const { createVoucher } = useCreateDebitVoucher(
    (response) => {
      if (response?.result) {
        setDialogMessage(response.message);
        setOpenDialog(true); // Show success dialog
      } else if (Array.isArray(response) && response.length > 0) {
        const errorMessages = response.map((err) => err.msg).join(', ');
        setDialogMessage(errorMessages);
        setOpenDialog(true); // Show error dialog
      }
    },
    (error) => {
      let errorMessage = error.message;
      if (Array.isArray(error)) {
        errorMessage = error[0].msg;
      } else {
        errorMessage = 'An error occurred while creating the voucher.';
      }
      setDialogMessage(errorMessage);
      setOpenDialog(true); // Show error dialog
    }
  );

  const steps = ['Basic Details', 'Voucher Items'];
  const [activeStep, setActiveStep] = useState(0);

  const validationSchema = useMemo(() => {
    if (activeStep === 0) {
      return firstStepValidationSchema;
    } else if (activeStep === 1) {
      return secondStepValidationSchema;
    } else {
      return Yup.object().shape({});
    }
  }, [activeStep]);

 const handleNext = async (
    validateForm: () => Promise<FormikErrors<InitialValues>>,
    setTouched: (touched: FormikTouched<InitialValues>) => Promise<void | FormikErrors<InitialValues>>
  ) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      const touchedProperties: FormikTouched<InitialValues> = Object.keys(initialValues).reduce((acc, key) => {
        if (key !== 'items') {
          acc[key as keyof Omit<InitialValues, "items" | "projectFiles">] = true;
        }
        return acc;
      }, {} as FormikTouched<InitialValues>);

      setTouched(touchedProperties);
    }
  };

  const handleSubmit = async (values: InitialValues, actions: { resetForm: () => void }) => {
    try {
      const getSelectedGST = [...gstLists].find((gst) => gst.value === values.gst);
      const getSelectedTDS = [...tdsLists].find((tds) => tds.value === values.tds);
      const formatedValues = await formateCreateVoucherPayload({
        values: values,
        gstPercent: getSelectedGST?.percent,
        tdsPercent: getSelectedTDS?.percent
      });

      if (formatedValues) {
        setIsCreatingVoucher(true); // Set loading state for submission
        await createVoucher(formatedValues as any);
        setActiveStep(0); // Reset to first step after success
        actions.resetForm(); // Reset form after success
        setIsCreatingVoucher(false); // Reset loading state
      }
    } catch (error) {
      console.error('Error creating voucher', error);
      setDialogMessage('An error occurred while creating the voucher.');
      setOpenDialog(true); // Show error dialog on failure
    }
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const isLastStep = activeStep === steps.length - 1;
  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {(formikProps) => {
          const { values, touched, errors, setFieldValue, handleChange, handleSubmit, handleBlur, validateForm, setTouched } = formikProps;
          const handleChangeAccountHead = (name: string, value: number) => {
            setFieldValue(name, value);
          };
          const getSelectedGST = [...gstLists].find((gst) => gst.value === values.gst);
          const getSelectedTDS = [...tdsLists].find((tds) => tds.value === values.tds);
          const files = useMemo(() => values.projectFiles, [values]);
          const { accountHeads } = useGetAccountHead(values.projectId);

          const [open, setOpen] = useState(false);

          return (
            <MainCard title={<VoucherCardTitle voucherType="Debit Voucher" titleText="Vendor"></VoucherCardTitle>}>
              <Stepper activeStep={activeStep} orientation="vertical">
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
                      {index === 0 && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} p={2}>
                            <Grid container spacing={1} direction="column">
                              {/* Project Code */}
                              <Grid item xs={12} md={12}>
                                <InputLabel sx={{ mb: 1 }}>{'Project Code'}</InputLabel>
                                <Autocomplete
                                  sx={{
                                    '& .MuiInputBase-root': {
                                      height: '48px',
                                      minWidth: '250px',
                                      maxWidth: 'auto'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                      padding: 0
                                    },
                                    '& .MuiAutocomplete-inputRoot': {
                                      padding: '0 14px'
                                    }
                                  }}
                                  onChange={(_e, project) => {
                                    setFieldValue('projectId', project?.value ?? null);
                                  }}
                                  defaultValue={projects.find((project) => project.value === values.projectId) ?? null}
                                  isOptionEqualToValue={(option, value) => option.value === value.value}
                                  style={{ width: '100%' }}
                                  id="projectId"
                                  options={projects}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={touched.projectId && Boolean(errors.projectId)}
                                      helperText={touched.projectId && errors.projectId}
                                      name="projectId"
                                      placeholder="Project Code"
                                    />
                                  )}
                                />
                              </Grid>
                              {/* Project Code */}

                              {/* <Grid item xs={12} md={12}>
                                <InputLabel sx={{ mb: 1 }}>{'Vendor Name'}</InputLabel>
                                    <Button
                                    variant="shadow"
                                    color="primary"
                                    fullWidth
                                    onClick={() => navigate('/add-vendor')}
                                    sx={{ height: '30px', width: '20px' }}
                                  >
                                    +
                                  </Button>
                                <Autocomplete
                                  sx={{
                                    '& .MuiInputBase-root': {
                                      height: '48px',
                                      minWidth: '250px',
                                      maxWidth: 'auto'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                      padding: 0
                                    },
                                    '& .MuiAutocomplete-inputRoot': {
                                      padding: '0 14px'
                                    }
                                  }}
                                  onChange={(_e, vendor) => {
                                    setFieldValue('vendorId', vendor?.value ?? '');
                                  }}
                                  defaultValue={vendors.find((vendor) => vendor.value === values.vendorId) ?? null}
                                  isOptionEqualToValue={(option, value) => option.value === value.value}
                                  style={{ width: '100%' }}
                                  id="vendorId"
                                  options={vendors}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name="vendorId"
                                      placeholder="Vendor Name"
                                      error={touched.vendorId && Boolean(errors.vendorId)}
                                      helperText={touched.vendorId && errors.vendorId}
                                    />
                                  )}
                                />
                              </Grid> */}

                              <Grid item xs={12} md={12} spacing={1}>
                                <Stack direction="row" justifyContent="space-between">
                                  <InputLabel sx={{ mb: 1 }}>{'Vendor Name'}</InputLabel>
                                  <Button
                                    variant="shadow"
                                    color="primary"
                                    fullWidth
                                    onClick={modalToggler}
                                    sx={{ height: '30px', width: '20px', mb: 1 }}
                                  >
                                    +
                                  </Button>
                                </Stack>


                                <Grid container spacing={1} alignItems="center">
                                  {/* Vendor Autocomplete */}
                                  <Grid item xs={10}>
                                    <Autocomplete
                                      sx={{
                                        '& .MuiInputBase-root': {
                                          height: '48px',
                                          minWidth: '270px',
                                          maxWidth: 'auto'
                                        },
                                        '& .MuiOutlinedInput-root': {
                                          padding: 0
                                        },
                                        '& .MuiAutocomplete-inputRoot': {
                                          padding: '0 14px'
                                        }
                                      }}
                                      onChange={(_e, vendor) => {
                                        setFieldValue('vendorId', vendor?.value ?? '');
                                      }}
                                      defaultValue={vendors.find((vendor) => vendor.value === values.vendorId) ?? null}
                                      isOptionEqualToValue={(option, value) => option.value === value.value}
                                      style={{ width: '120%' }}
                                      id="vendorId"
                                      options={vendors}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          name="vendorId"
                                          placeholder="Vendor Name"
                                          error={touched.vendorId && Boolean(errors.vendorId)}
                                          helperText={touched.vendorId && errors.vendorId}
                                        />
                                      )}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12} md={12}>
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
                              <Grid item xs={12} md={4}>
                                <InputLabel sx={{ mb: 1 }}>{'GST'}</InputLabel>
                                <FormControl sx={{ width: '100%', height: '100%' }}>
                                  <Select
                                    displayEmpty
                                    placeholder="Select GST"
                                    name="gst"
                                    value={values.gst}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  >
                                    <MenuItem disabled value="0">
                                      Select GST
                                    </MenuItem>
                                    {[...gstLists].map((gst) => (
                                      <MenuItem value={gst.value}>{gst.label}</MenuItem>
                                    ))}
                                  </Select>
                                  {touched.gst && Boolean(errors.gst) && (
                                    <FormHelperText error={Boolean(errors.gst)}>{errors.gst}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} md={12}>
                                <InputLabel sx={{ mb: 1 }}>{'TDS'}</InputLabel>
                                <FormControl sx={{ width: '100%', height: '100%' }}>
                                  <Select
                                    displayEmpty
                                    placeholder="Select TDS"
                                    name="tds"
                                    value={values.tds}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  >
                                    <MenuItem disabled value="0">
                                      Select TDS
                                    </MenuItem>
                                    {[...tdsLists].map((tds) => (
                                      <MenuItem value={tds.value}>{tds.label}</MenuItem>
                                    ))}
                                  </Select>
                                  {touched.tds && Boolean(errors.tds) && (
                                    <FormHelperText error={Boolean(errors.tds)}>{errors.tds}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={6} p={2}>
                            <Grid container direction="column" spacing={1}>
                              <Grid item xs={12} sm={12}>
                                <InputLabel sx={{ mb: 1 }}>Select Bank</InputLabel>
                                <Autocomplete
                                  sx={{
                                    '& .MuiInputBase-root': {
                                      height: '48px',
                                      minWidth: '250px',
                                      maxWidth: 'auto'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                      padding: 0
                                    },
                                    '& .MuiAutocomplete-inputRoot': {
                                      padding: '0 14px'
                                    }
                                  }}
                                  value={bankListData.find((bank: { id: string | number }) => String(bank.id) === String(values.bank_id)) || null}

                                  onChange={(_e, bank) => {
                                    setFieldValue('bank_id', bank?.id ?? '');
                                  }}
                                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                  options={bankListData}
                                  getOptionLabel={(option) =>
                                    `${option.account_type?.name || 'N/A'} - ${option.account_number || ''}`
                                  }
                                  loading={loading}
                                  renderOption={(props, option) => (
                                    <li {...props}>
                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>{`${option.account_type?.name || 'N/A'} - ${option.account_number}`}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                          ({option.bank_name})
                                        </span>
                                      </div>
                                    </li>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name="bank_id"
                                      placeholder="Select Bank"
                                      error={touched.bank_id && Boolean(errors.bank_id)}
                                      helperText={touched.bank_id && errors.bank_id}
                                    />
                                  )}
                                />
                              </Grid>
                              {[
                                {
                                  id: 2,
                                  label: 'Letter No / Ref No :',
                                  field: 'letterReferenceNo',
                                  type: 'input'
                                },
                                {
                                  id: 4,
                                  label: 'Narration',
                                  field: 'narration',
                                  type: 'textarea'
                                }
                              ].map((field: any) => {
                                return (
                                  <Grid item xs={12} md={12}>
                                    <InputLabel sx={{ mb: 1 }}>{field.label}</InputLabel>
                                    <TextField
                                      type={field.type}
                                      id={field.field}
                                      name={field.field}
                                      placeholder={`Enter ${field.label}`}
                                      value={values[field.field as keyof typeof initialValues]}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched[field.field as keyof typeof initialValues] &&
                                        Boolean(errors[field.field as keyof typeof initialValues])
                                      }
                                      helperText={
                                        touched[field.field as keyof typeof initialValues] &&
                                        (errors[field.field as keyof typeof initialValues] as any)
                                      }
                                      fullWidth
                                    />
                                  </Grid>
                                );
                              })}

                            </Grid>
                          </Grid>

                        </Grid>
                      )}
                      {/* {index === 1 && (
                        <Grid item xs={12} sm={6}>
                          <MainCard border={false}>
                            <Grid xs={12} container direction="row" spacing={1}>
                              <Grid item xs={12} md={4}>
                                <InputLabel sx={{ mb: 1 }}>{'Payment Type'}</InputLabel>
                                <FormControl sx={{ width: '100%', height: '100%' }}>
                                  <Select
                                    // value={values.paymentTypes}
                                    displayEmpty
                                    placeholder="Select Payment Type"
                                    name="paymentType"
                                    value={values.paymentType}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={touched.paymentType && Boolean(errors.paymentType)}
                                  >
                                    <MenuItem disabled value="0">
                                      Select Payment Type
                                    </MenuItem>
                                    {[...paymentTypes].map((paymentType) => (
                                      <MenuItem value={paymentType.value}>{paymentType.label}</MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <InputLabel sx={{ mb: 1 }}>{'Payment Ref /Chq No'}</InputLabel>
                                <TextField
                                  placeholder={`Enter Payment Ref /Chq No`}
                                  value={values.paymentRef}
                                  id="paymentRef"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.paymentRef && Boolean(errors.paymentRef)}
                                  helperText={touched.paymentRef && errors.paymentRef}
                                  fullWidth
                                />
                              </Grid>
                            </Grid>
                          </MainCard>
                        </Grid>
                      )} */}
                      {index === 1 && (
                        <Grid item xs={12}>
                          <FieldArray
                            validateOnChange={false}
                            name="items"
                            render={({ remove, push }) => {
                              // const totalAmount = values.items.reduce((acc: number, item: any) => {
                              //   const taxData = getTaxData(item.taxableAmount, getSelectedGST?.percent, getSelectedTDS?.percent);
                              //   return acc + taxData?.netAmount;
                              // }, 0);
                              const totalAmount = values.items.reduce((acc: number, item: any) => {
                                const taxData = getTaxData(item.taxableAmount, getSelectedGST?.percent, getSelectedTDS?.percent);
                                return acc + taxData?.totalAmount; // Correct property
                              }, 0);


                              return (
                                <>
                                  <TableContainer style={{ overflowX: 'auto' }}>
                                    <Table sx={{ minWidth: 650, width: 'auto' }}>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Item</TableCell>
                                          <TableCell>Account Head</TableCell>
                                          <TableCell>Taxable Amount</TableCell>
                                          <TableCell>GST</TableCell>
                                          <TableCell>TDS</TableCell>
                                          <TableCell>Net Amount</TableCell>
                                          <TableCell>Total Amount</TableCell>
                                          <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {typeof errors.items === 'string' && (
                                          <Stack sx={{ width: '100%' }}>
                                            <Alert variant="standard" sx={{ my: 2, minWidth: '100%' }} severity="error">
                                              {errors.items}
                                            </Alert>
                                          </Stack>
                                        )}
                                        {values.items?.map((item: Item, index: number) => {
                                          const taxData = getTaxData(item.taxableAmount, getSelectedGST?.percent, getSelectedTDS?.percent);
                                          return (
                                            <TableRow key={item.id}>
                                              <VoucherItem
                                                key={item.id}
                                                id={item.id}
                                                index={index}
                                                name={item.name}
                                                taxableAmount={item.taxableAmount}
                                                account_head_id={item.account_head_id}
                                                onDeleteItem={(index: number) => remove(index)}
                                                onEditItem={handleChange}
                                                handleChangeAccountHead={handleChangeAccountHead}
                                                Blur={handleBlur}
                                                errors={errors}
                                                accountHeads={accountHeads}
                                                touched={touched}
                                                taxData={taxData}
                                              />
                                            </TableRow>
                                          );
                                        })}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <Divider />
                                  <Grid container justifyContent="space-between">
                                    <Grid item xs={12} md={8}>
                                      <Box sx={{ pt: 2.5, pr: 2.5, pb: 2.5, pl: 0 }}>
                                        <Button
                                          color="primary"
                                          startIcon={<Add />}
                                          onClick={() =>
                                            push({
                                              id: values.items.length + 1,
                                              name: '',
                                              account_head_id: 0,
                                              amount: 0
                                            })
                                          }
                                          variant="dashed"
                                          sx={{ bgcolor: 'transparent !important' }}
                                        >
                                          Add Item
                                        </Button>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <Grid item xs={12} p={2}>
                                        <Stack direction="row" justifyContent="space-between">
                                          <Typography variant="subtitle1">Grand Net Amount:</Typography>
                                          <Typography variant="subtitle1">{totalAmount}</Typography>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                    {/* pdf adder */}
                                    <Grid item xs={12} md={12}>
                                      <ReactFilesPreview
                                        files={files}
                                        getFiles={(files) => {
                                          setFieldValue("projectFiles", files);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              );
                            }}
                          />
                        </Grid>
                      )}
                      <Box sx={{ mb: 2 }}>
                        <div>
                          {index === steps.length - 1 ? null : (
                            <Button
                              variant="contained"
                              onClick={() => handleNext(validateForm, setTouched)}
                              sx={{ mt: 1, mr: 1 }}
                              color={index === steps.length - 1 ? 'success' : 'primary'}
                            >
                              {'Continue'}
                            </Button>
                          )}
                          <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                            Back
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  onClick={async () => {
                    await handleNext(validateForm, setTouched);
                    if (isLastStep) {
                      handleSubmit();
                    }
                  }}
                  variant="contained"
                  color="primary"
                >
                  {isCreatingVoucher ? 'Loading..' : isLastStep ? 'Save' : 'Continue'}
                </Button>
                <Button
                  onClick={() => {
                    setActiveStep((prev) => Math.max(0, prev - 1));
                  }}
                  variant="outlined"
                  color="secondary"
                >
                  Back
                </Button>
              </CardActions> */}
              <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          onClick={async () => {
            await handleNext(validateForm, setTouched);
            if (isLastStep) {
              handleSubmit();
            }
          }}
          variant="contained"
          color="primary"
        >
          {isCreatingVoucher ? 'Loading..' : isLastStep ? 'Save' : 'Continue'}
        </Button>
        <Button
          onClick={() => {
            setActiveStep((prev) => Math.max(0, prev - 1));
          }}
          variant="outlined"
          color="secondary"
        >
          Back
        </Button>
      </CardActions>

      {/* Dialog for Success/Error Message */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{dialogMessage.includes('error') ? 'Error' : 'Success'}</DialogTitle>
        <DialogContent>
          <p>{dialogMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
            </MainCard>
          );
        }}
      </Formik>
    </>
  );
}
