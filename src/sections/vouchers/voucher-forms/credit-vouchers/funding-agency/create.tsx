import { useState, useMemo } from 'react';

import MainCard from 'components/MainCard';
import VoucherItem from './voucher-item';
import { openSnackbar } from 'api/snackbar';
import { useCreateCreditVoucher, useGetAccountHead, useGetOwnBankAccounts, useGetPaymentType, useGetProjectList } from 'api/voucher';

import { FieldArray, Formik, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';

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
  CardActions,
  FormHelperText
} from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add } from 'iconsax-react';

// utils
import dayjs from 'dayjs';
import InputMask from 'react-input-mask';
import { firstStepValidationSchema, secondStepValidationSchema, initialValues, formateCreateVoucherPayload, InitialValues } from './utils';

import { SnackbarProps } from 'types/snackbar';
import VoucherCardTitle from '../../components/voucher-card-title';
import { InputAdornment } from '@mui/material';
import { ReactFilesPreview } from 'sections/projects/add-project/FilePicker/ReactFilesPreview';
import { useGetDonorList } from 'api/masters';


// ==============================|| Account Voucher - ADD Voucher ||============================== //

export default function AddFundingAgencyVoucher() {
  const { paymentTypes } = useGetPaymentType();
  const { projects } = useGetProjectList();
  const { accountHeads } = useGetAccountHead(['R', 'C']);
  const { DonorList, DonorListLoading, DonorError } = useGetDonorList();
  const { bankListData, loading } = useGetOwnBankAccounts();


  const donorTypeOptions = Array.isArray(DonorList) ? DonorList : [];

  const { createVoucher, isLoading: isCreatingVoucher } = useCreateCreditVoucher(
    (response: any) => {
      // console.log(response);
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
      }
    },
    (error: any) => {
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
      const formatedValues = await formateCreateVoucherPayload(values);
      if (formatedValues) {
        await createVoucher(formatedValues as any);
        setActiveStep(0);
        actions.resetForm();
      }
    } catch (error) {
      console.error('Error creating voucher', error);
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
          const files = useMemo(() => values.projectFiles, [values]);
          return (
            <MainCard title={<VoucherCardTitle voucherType="Credit Voucher" titleText="Donor"></VoucherCardTitle>}>
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
                              <Grid item xs={12} sm={6}>
                                <InputLabel sx={{ mb: 1 }}>Donor Type</InputLabel>
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
                                  value={donorTypeOptions.find(donor => donor.id === values.donor_type_id) || null}
                                  onChange={(_e, donor) => {
                                    setFieldValue('donor_type_id', donor?.id ?? ''); // Set the donor type id in Formik values
                                  }}
                                  isOptionEqualToValue={(option, value) => option.id === value.id}
                                  options={donorTypeOptions}
                                  getOptionLabel={(option) => option.name}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name="donor_type_id"
                                      placeholder="Select Donor Type"
                                      error={touched.donor_type_id && Boolean(errors.donor_type_id)} // Validation error display
                                      helperText={touched.donor_type_id && errors.donor_type_id}
                                    />
                                  )}
                                />
                              </Grid>

                              {/* Voucher Date */}
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
                              {/* Voucher Date */}
                              {/* Voucher Number */}
                              {/* <Grid item xs={12} md={12}>
                                <InputLabel sx={{ mb: 1 }}>{'Voucher Number'}</InputLabel>
                                <InputMask
                                  mask={`999`}
                                  value={values.voucherNo}
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
                                            <InputAdornment position="start">
                                              Month - {dayjs(values.voucherDate).format('MM')}
                                            </InputAdornment>
                                          )
                                        }}
                                        id="voucherNo"
                                        name="voucherNo"
                                        placeholder={`XXX`}
                                        value={values.voucherNo}
                                        error={touched.voucherNo && Boolean(errors.voucherNo)}
                                        helperText={touched.voucherNo && errors.voucherNo}
                                        fullWidth
                                        {...inputProps}
                                      />
                                    );
                                  }}
                                </InputMask>
                              </Grid> */}
                              {/* Voucher Number */}

                              <Grid item xs={12} md={6}>
                                <InputLabel sx={{ mb: 1 }}>{'Payment Type'}</InputLabel>
                                <FormControl sx={{ width: '100%', height: '100%' }}>
                                  <Select
                                    displayEmpty
                                    placeholder="Select Payment Type"
                                    name="paymentType"
                                    value={values.paymentType}
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
                                  {touched.paymentType && Boolean(errors.paymentType) && (
                                    <FormHelperText error={Boolean(errors.paymentType)}>{errors.paymentType}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={6} p={2}>
                            <Grid container direction="column" spacing={1}>
                              <Grid item xs={12} sm={6}>
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
                                  value={bankListData.find((bank: { value: string; }) => bank.value === values.bank_id) || null}
                                  onChange={(_e, bank) => {
                                    setFieldValue('bank_id', bank?.value ?? '');
                                  }}
                                  isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                  options={bankListData}
                                  getOptionLabel={(option) => option.label || ''}
                                  loading={loading}
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
                                },
                                {
                                  id: 6,
                                  label: 'Enter Payment Bank /Chq No',
                                  field: 'paymentRef',
                                  type: 'input'
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
                      {index === 1 && (
                        <Grid item xs={12}>
                          <FieldArray
                            validateOnChange={false}
                            name="items"
                            render={({ remove, push }) => {
                              const totalAmount = values.items.reduce((acc: number, item: any) => {
                                return acc + item.amount;
                              }, 0);
                              return (
                                <>
                                  <TableContainer>
                                    <Table sx={{ minWidth: 650 }}>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Item</TableCell>
                                          <TableCell>Account Head</TableCell>
                                          <TableCell>Amount</TableCell>
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
                                        {values.items?.map((item: any, index: number) => (
                                          <TableRow key={item.id}>
                                            <VoucherItem
                                              key={item.id}
                                              id={item.id}
                                              index={index}
                                              name={item.name}
                                              amount={item.amount}
                                              account_head_id={item.account_head_id}
                                              onDeleteItem={(index: number) => remove(index)}
                                              onEditItem={handleChange}
                                              handleChangeAccountHead={handleChangeAccountHead}
                                              Blur={handleBlur}
                                              errors={errors}
                                              accountHeads={accountHeads}
                                              touched={touched}
                                            />
                                          </TableRow>
                                        ))}
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
                                          <Typography variant="subtitle1">Grand Total:</Typography>
                                          <Typography variant="subtitle1">{totalAmount}</Typography>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                    {/* pdf adder */}
                                    <Grid item xs={12} md={12}>
                                      <ReactFilesPreview
                                        files={files}
                                        getFiles={(files) => {
                                          setFieldValue('projectFiles', files);
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
            </MainCard>
          );
        }}
      </Formik>
    </>
  );
}
