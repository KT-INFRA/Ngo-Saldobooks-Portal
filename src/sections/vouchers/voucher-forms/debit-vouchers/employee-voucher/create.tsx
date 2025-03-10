import { useState, useMemo } from "react";

import MainCard from "components/MainCard";
import VoucherItem from "./voucher-item";
import { openSnackbar } from "api/snackbar";
import {
  useCreateDebitVoucher,
  useGetAccountHead,
  useGetEmployeeList,
  useGetOwnBankAccounts,
  useGetProjectList,
} from "api/voucher";

import { FieldArray, Formik, FormikErrors, FormikTouched } from "formik";
import * as Yup from "yup";

import {
  Alert,
  Autocomplete,
  Box,
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
  Stack,
  TextField,
  Typography,
  Divider,
  Button,
  CardActions,
} from "@mui/material";
import { Add } from "iconsax-react";

// utils
import {
  firstStepValidationSchema,
  secondStepValidationSchema,
  initialValues,
  InitialValues,
  Item,
  formateCreateVoucherPayload,
} from "./utils";

import { SnackbarProps } from "types/snackbar";
import VoucherCardTitle from "../../components/voucher-card-title";
import { ReactFilesPreview } from "sections/projects/add-project/FilePicker/ReactFilesPreview";

// ==============================|| Account Voucher - ADD Voucher ||============================== //

export default function EmployeeVoucher() {
  const { projects } = useGetProjectList();
  const { accountHeads } = useGetAccountHead(["D", "B"]);
  const { employees } = useGetEmployeeList(true);
  const { bankListData, loading } = useGetOwnBankAccounts();


  const { createVoucher, isLoading: isCreatingVoucher } = useCreateDebitVoucher(
    (response: any) => {
      if (response?.result) {
        // Success response
        openSnackbar({
          open: true,
          message: response.message,
          anchorOrigin: { vertical: "top", horizontal: "right" },
          variant: "alert",
          alert: {
            color: "success",
          },
        } as SnackbarProps);
      } else if (Array.isArray(response) && response.length > 0) {
        // Handling validation errors
        const errorMessages = response.map((err) => err.msg).join(", ");
        openSnackbar({
          open: true,
          message: errorMessages,
          anchorOrigin: { vertical: "top", horizontal: "right" },
          variant: "alert",
          alert: {
            color: "error",
          },
        } as SnackbarProps);
      }
    },
    (error: any) => {
      var errorMessage = error.message;
      if (Array.isArray(error)) {
        errorMessage = error[0].msg;
      } else {
        errorMessage = "An error occurred while updating the project.";
      }
      openSnackbar({
        open: true,
        message: errorMessage,
        anchorOrigin: { vertical: "top", horizontal: "right" },
        variant: "alert",
        alert: {
          color: "error",
        },
      } as SnackbarProps);
    }
  );

  const steps = ["Basic Details", "Voucher Items"];
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
    setTouched: (
      touched: FormikTouched<InitialValues>
    ) => Promise<void | FormikErrors<InitialValues>>
  ) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      const touchedProperties: FormikTouched<InitialValues> = Object.keys(
        initialValues
      ).reduce((acc, key) => {
        if (key !== "items") {
          acc[key as keyof Omit<InitialValues, "items" | "projectFiles">] = true;
        }
        return acc;
      }, {} as FormikTouched<InitialValues>);

      setTouched(touchedProperties);
    }
  };

  const handleSubmit = async (
    values: InitialValues,
    actions: { resetForm: () => void }
  ) => {
    try {
      const formatedValues = await formateCreateVoucherPayload(values);
      // console.log('formatedValues1', formatedValues);
      if (formatedValues) {
        await createVoucher(formatedValues as any);
        setActiveStep(0);
        actions.resetForm();
      }
    } catch (error) {
      console.error("Error creating voucher", error);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => {
          const {
            values,
            touched,
            errors,
            setFieldValue,
            handleChange,
            handleSubmit,
            handleBlur,
            validateForm,
            setTouched,
          } = formikProps;
          const handleChangeSelectvalue = (name: string, value: number) => {
            setFieldValue(name, value);
          };
          const files = useMemo(() => values.projectFiles, [values]);
          return (
            <MainCard
              title={
                <VoucherCardTitle
                  voucherType="Debit Voucher"
                  titleText="Employee/JRF"
                ></VoucherCardTitle>
              }
            >
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step}>
                    <StepLabel
                      onClick={() => {
                        // setActiveStep(index);
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      {step}
                    </StepLabel>
                    <StepContent>
                      {index === 0 && (
                        <Grid container spacing={2} p={0}>
                          <Grid item xs={12} sm={6} p={2}>
                            <Grid container spacing={1} direction="column">
                              {/* Project Code */}
                              <Grid item xs={12} md={12}>
                                <InputLabel sx={{ mb: 1 }}>
                                  {"Project Code"}
                                </InputLabel>
                                <Autocomplete
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "48px",
                                      minWidth: "250px",
                                      maxWidth: "auto",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                      padding: 0,
                                    },
                                    "& .MuiAutocomplete-inputRoot": {
                                      padding: "0 14px",
                                    },
                                  }}
                                  onChange={(_e, project) => {
                                    // setFieldValue(
                                    //   "projectId",
                                    //   project?.value ?? ""
                                    // );
                                    setFieldValue('projectId', project?.value ?? null);
                                  }}
                                  defaultValue={
                                    projects.find(
                                      (project) =>
                                        project.value === values.projectId
                                    ) ?? null
                                  }
                                  isOptionEqualToValue={(option, value) =>
                                    option.value === value.value
                                  }
                                  style={{ width: "100%" }}
                                  id="projectId"
                                  options={projects}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={
                                        touched.projectId &&
                                        Boolean(errors.projectId)
                                      }
                                      helperText={
                                        touched.projectId && errors.projectId
                                      }
                                      name="projectId"
                                      placeholder="Project Code"
                                    />
                                  )}
                                />
                              </Grid>

                              {/* Project Code */}
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Grid container direction="column" spacing={1}>
                              {[
                                {
                                  id: 2,
                                  label: "Letter No / Ref No :",
                                  field: "letterReferenceNo",
                                  type: "input",
                                },
                              ].map((field: any) => {
                                return (
                                  <Grid item xs={12}>
                                    <InputLabel sx={{ mb: 1 }}>
                                      {field.label}
                                    </InputLabel>
                                    <TextField
                                      type={field.type}
                                      id={field.field}
                                      name={field.field}
                                      placeholder={`Enter ${field.label}`}
                                      value={
                                        values[
                                        field.field as keyof typeof initialValues
                                        ]
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      error={
                                        touched[
                                        field.field as keyof typeof initialValues
                                        ] &&
                                        Boolean(
                                          errors[
                                          field.field as keyof typeof initialValues
                                          ]
                                        )
                                      }
                                      helperText={
                                        touched[
                                        field.field as keyof typeof initialValues
                                        ] &&
                                        (errors[
                                          field.field as keyof typeof initialValues
                                        ] as any)
                                      }
                                      fullWidth
                                    />
                                  </Grid>
                                );
                              })}
                            </Grid>

                          </Grid>
                          <Grid item xs={12} sm={6} p={2}>
                            <InputLabel sx={{ mb: 1 }}>
                              {"Narration"}
                            </InputLabel>
                            <TextField
                              id="narration"
                              name="narration"
                              placeholder={`Narration`}
                              type={"text"}
                              value={values.narration}
                              error={
                                touched.narration && Boolean(errors.narration)
                              }
                              helperText={touched.narration && errors.narration}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              fullWidth
                            />
                          </Grid>
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
                        </Grid>
                      )}
                      {index === 1 && (
                        <Grid item xs={12}>
                          <FieldArray
                            validateOnChange={false}
                            name="items"
                            render={({ remove, push }) => {
                              const totalAmount = values.items.reduce(
                                (acc: number, item: any) => {
                                  return acc + item?.amount;
                                },
                                0
                              );
                              return (
                                <>
                                  <TableContainer style={{ overflowX: "auto" }}>
                                    <Table
                                      sx={{ minWidth: 650, width: "auto" }}
                                    >
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Employee</TableCell>
                                          <TableCell>Account Head</TableCell>
                                          <TableCell>Item</TableCell>
                                          <TableCell>Amount</TableCell>
                                          <TableCell align="center">
                                            Action
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {typeof errors.items === "string" && (
                                          <Stack sx={{ width: "100%" }}>
                                            <Alert
                                              variant="standard"
                                              sx={{ my: 2, minWidth: "100%" }}
                                              severity="error"
                                            >
                                              {errors.items}
                                            </Alert>
                                          </Stack>
                                        )}
                                        {values.items?.map(
                                          (item: Item, index: number) => {
                                            return (
                                              <TableRow key={item.id}>
                                                <VoucherItem
                                                  key={item.id}
                                                  id={item.id}
                                                  index={index}
                                                  name={item.name}
                                                  amount={item.amount}
                                                  beneficiary_id={
                                                    item.beneficiary_id
                                                  }
                                                  account_head_id={
                                                    item.account_head_id
                                                  }
                                                  onDeleteItem={(
                                                    index: number
                                                  ) => remove(index)}
                                                  onEditItem={handleChange}
                                                  handleChangeSelectvalue={
                                                    handleChangeSelectvalue
                                                  }
                                                  Blur={handleBlur}
                                                  errors={errors}
                                                  accountHeads={accountHeads}
                                                  employees={employees}
                                                  touched={touched}
                                                />
                                              </TableRow>
                                            );
                                          }
                                        )}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <Divider />
                                  <Grid
                                    container
                                    justifyContent="space-between"
                                  >
                                    <Grid item xs={12} md={8}>
                                      <Box
                                        sx={{
                                          pt: 2.5,
                                          pr: 2.5,
                                          pb: 2.5,
                                          pl: 0,
                                        }}
                                      >
                                        <Button
                                          color="primary"
                                          startIcon={<Add />}
                                          onClick={() =>
                                            push({
                                              id: values.items.length + 1,
                                              name: "",
                                              account_head_id: 0,
                                              amount: 0,
                                            })
                                          }
                                          variant="dashed"
                                          sx={{
                                            bgcolor: "transparent !important",
                                          }}
                                        >
                                          Add Item
                                        </Button>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <Grid item xs={12} p={2}>
                                        <Stack
                                          direction="row"
                                          justifyContent="space-between"
                                        >
                                          <Typography variant="subtitle1">
                                            Grand Total:
                                          </Typography>
                                          <Typography variant="subtitle1">
                                            {totalAmount}
                                          </Typography>
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
                              onClick={() =>
                                handleNext(validateForm, setTouched)
                              }
                              sx={{ mt: 1, mr: 1 }}
                              color={
                                index === steps.length - 1
                                  ? "success"
                                  : "primary"
                              }
                            >
                              {"Continue"}
                            </Button>
                          )}
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Back
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              <CardActions sx={{ justifyContent: "flex-end" }}>
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
                  {isCreatingVoucher
                    ? "Loading.."
                    : isLastStep
                      ? "Save"
                      : "Continue"}
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
