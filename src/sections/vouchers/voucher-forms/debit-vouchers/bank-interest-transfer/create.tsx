import { useState, useMemo } from "react";

// material-ui
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Autocomplete,
  Box,
  FormControl,
  Select,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CardActions,
  Tab,
} from "@mui/material";
// project-imports
import MainCard from "components/MainCard";

// assets
import { Formik, FormikErrors, FormikTouched } from "formik";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  useCreateBankInterestDebitVoucher,
  useGetAccountHead,
  useGetIFGTBAccounts,
  useGetPaymentType,
  useGetProjectList,
} from "api/voucher";
import dayjs from "dayjs";
import * as Yup from "yup";
import {
  firstStepValidationSchema,
  secondStepValidationSchema,
  initialValues,
  formateCreateBankVoucherPayload,
  InitialValues,
  thirdValidationSchema,
} from "./utils";
import { SnackbarProps } from "types/snackbar";
import { openSnackbar } from "api/snackbar";
import InputMask from "react-input-mask";
import VoucherCardTitle from "../../components/voucher-card-title";
import { Tabs } from "@mui/material";
import { Bank, MoneyRecive } from "iconsax-react";
import TabPanel from "../../components/tab-panel";
import { InputAdornment } from "@mui/material";
import { ReactFilesPreview } from "sections/projects/add-project/FilePicker/ReactFilesPreview";
// ==============================|| ECOMMERCE - ADD Voucher ||============================== //

export default function BankInterestTransferVoucher() {
  const { paymentTypes } = useGetPaymentType();
  const { projects } = useGetProjectList();
  // const { accountHeads } = useGetAccountHead(["I"]);
  const { ifgtbAccounts } = useGetIFGTBAccounts();
  const { createVoucher, isLoading: isCreatingVoucher } =
    useCreateBankInterestDebitVoucher(
      (response: any) => {
        // console.log(response);
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

  const steps = ["Basic Details", "Payment Details", "Transfer To"];
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const validationSchema = useMemo(() => {
    if (activeStep === 0) {
      return firstStepValidationSchema;
    } else if (activeStep === 1) {
      return secondStepValidationSchema;
    } else if (activeStep === 2) {
      return thirdValidationSchema(selectedTab);
    } else {
      return Yup.object().shape({});
    }
  }, [activeStep, selectedTab]);

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
        acc[key as keyof InitialValues] = true;
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
      const formatedValues = await formateCreateBankVoucherPayload(
        values,
        selectedTab
      );
      // console.log(formatedValues);
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
          const files = useMemo(() => values.projectFiles, [values]);
          const { accountHeads } = useGetAccountHead(values.projectId);
          return (
            <MainCard
              title={
                <VoucherCardTitle
                  voucherType="Debit Voucher"
                  titleText="Bank Interest Transfer"
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
                        <Grid container spacing={2} p={2}>
                          <Grid item xs={12} sm={6}>
                            {/* <MainCard border={false}> */}
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
                                  onChange={(e, project) => {
                                    setFieldValue(
                                      "projectId",
                                      project?.value ?? ""
                                    );
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

                              {/* Voucher Date */}
                              <Grid item xs={12} md={12}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                >
                                  <InputLabel sx={{ mb: 1 }}>
                                    {"Voucher Date"}
                                  </InputLabel>
                                  <Stack>
                                    <MobileDatePicker
                                      format={"dd/MM/yyyy"}
                                      value={new Date(values.voucherDate)}
                                      onChange={(date) => {
                                        setFieldValue(
                                          "voucherDate",
                                          dayjs(date).format("YYYY-MM-DD")
                                        );
                                      }}
                                    />
                                  </Stack>
                                </LocalizationProvider>
                              </Grid>
                              {/* Voucher Date */}
                              {/* Voucher Number */}
                              <Grid item xs={12} md={12}>
                                <InputLabel sx={{ mb: 1 }}>
                                  {"Voucher Number"}
                                </InputLabel>
                                <InputMask
                                  mask={`999`}
                                  value={values.voucherNo}
                                  maskChar="0"
                                  alwaysShowMask={false}
                                  disabled={false}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  {(inputProps: {
                                    onChange: (
                                      event: React.ChangeEvent<HTMLInputElement>
                                    ) => void;
                                  }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="start">
                                              Month -{" "}
                                              {dayjs(values.voucherDate).format(
                                                "MM"
                                              )}
                                            </InputAdornment>
                                          ),
                                        }}
                                        id="voucherNo"
                                        name="voucherNo"
                                        placeholder={`XXX`}
                                        value={values.voucherNo}
                                        error={
                                          touched.voucherNo &&
                                          Boolean(errors.voucherNo)
                                        }
                                        helperText={
                                          touched.voucherNo && errors.voucherNo
                                        }
                                        fullWidth
                                        {...inputProps}
                                      />
                                    );
                                  }}
                                </InputMask>
                              </Grid>
                            </Grid>
                            {/* </MainCard> */}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {/* <MainCard border={false}> */}
                            <Grid container direction="column" spacing={1}>
                              <Grid item xs={12} md={12}>
                                <InputLabel sx={{ mb: 1 }}>
                                  {"Account Head"}
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
                                  onChange={(e, accountHead) => {
                                    setFieldValue(
                                      "accountHeadId",
                                      accountHead?.value ?? ""
                                    );
                                  }}
                                  isOptionEqualToValue={(option, value) =>
                                    option.value === value.value
                                  }
                                  style={{ width: "100%" }}
                                  id="account_head_id"
                                  defaultValue={
                                    accountHeads.find(
                                      (accountHead: {
                                        label: string;
                                        value: number;
                                      }) =>
                                        accountHead.value ===
                                        values.accountHeadId
                                    ) ?? null
                                  }
                                  options={accountHeads}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select AccountHead"
                                      error={
                                        touched.accountHeadId &&
                                        Boolean(errors.accountHeadId)
                                      }
                                      helperText={
                                        touched.accountHeadId &&
                                        errors.accountHeadId
                                      }
                                    />
                                  )}
                                />
                              </Grid>
                              {[
                                {
                                  id: 2,
                                  label: "Amount",
                                  field: "amount",
                                  type: "number",
                                },
                                {
                                  id: 4,
                                  label: "Narration",
                                  field: "narration",
                                  type: "textarea",
                                },
                              ].map(
                                (field: {
                                  id: number;
                                  label: string;
                                  field: string;
                                  type: string;
                                }) => {
                                  const value =
                                    values[
                                      field.field as keyof typeof initialValues
                                    ];
                                  return (
                                    <Grid item xl={12} xs={12} md={12}>
                                      <InputLabel sx={{ mb: 1 }}>
                                        {field.label}
                                      </InputLabel>
                                      <TextField
                                        type={field.type}
                                        id={field.field}
                                        name={field.field}
                                        placeholder={`Enter ${field.label}`}
                                        // eslint-disable-next-line eqeqeq
                                        value={value == 0 ? "" : value}
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
                                          errors[
                                            field.field as keyof typeof initialValues
                                          ]
                                        }
                                        fullWidth
                                      />
                                    </Grid>
                                  );
                                }
                              )}
                            </Grid>
                            {/* </MainCard> */}
                          </Grid>
                        </Grid>
                      )}
                      {index === 1 && (
                        <Grid item xs={12} sm={6} p={2}>
                          <Grid xs={12} container direction="row" spacing={1}>
                            <Grid item xs={12} md={6}>
                              <InputLabel sx={{ mb: 1 }}>
                                {"Payment Type"}
                              </InputLabel>
                              <FormControl
                                sx={{ width: "100%", height: "100%" }}
                              >
                                <Select
                                  displayEmpty
                                  placeholder="Select Payment Type"
                                  name="paymentType"
                                  value={values.paymentType}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  error={
                                    touched.paymentType &&
                                    Boolean(errors.paymentType)
                                  }
                                >
                                  <MenuItem disabled value="0">
                                    Select Payment Type
                                  </MenuItem>
                                  {[...paymentTypes].map((paymentType) => (
                                    <MenuItem value={paymentType.value}>
                                      {paymentType.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <InputLabel sx={{ mb: 1 }}>
                                {"Payment Ref /Chq No"}
                              </InputLabel>
                              <TextField
                                placeholder={`Enter Payment Ref /Chq No`}
                                value={values.paymentRef}
                                id="paymentRef"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.paymentRef &&
                                  Boolean(errors.paymentRef)
                                }
                                helperText={
                                  touched.paymentRef && errors.paymentRef
                                }
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                      {index === 2 && (
                        <Grid container xs={12} sm={12} p={2} gap={5}>
                          <Grid item>
                            <Tabs
                              orientation="vertical"
                              value={selectedTab}
                              onChange={handleChangeTab}
                            >
                              <Tab
                                label="Funding Agency"
                                value={0}
                                icon={<MoneyRecive />}
                                iconPosition="start"
                              />
                              <Tab
                                label="IFGTB Account"
                                value={1}
                                icon={<Bank />}
                                iconPosition="start"
                              />
                            </Tabs>
                          </Grid>
                          <Grid container xs={12} sm={12} xl={6} md={6}>
                            <TabPanel index={0} value={selectedTab}>
                              {/* <Grid item xs={12} md={12}>
                                <InputLabel sx={{ mb: 1 }}>
                                  {"Funding Agency"}
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
                                  onChange={(e, fundingAgency) => {
                                    setFieldValue(
                                      "fundingAgency",
                                      fundingAgency?.value ?? ""
                                    );
                                  }}
                                  isOptionEqualToValue={(option, value) =>
                                    option.value === value.value
                                  }
                                  style={{ width: "100%" }}
                                  id="fundingAgency"
                                  defaultValue={
                                    fundingAgencies.find(
                                      (fundingAgency) =>
                                        fundingAgency.value ===
                                        values.fundingAgency
                                    ) ?? null
                                  }
                                  options={fundingAgencies}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Funding Agency"
                                      error={
                                        touched.fundingAgency &&
                                        Boolean(errors.fundingAgency)
                                      }
                                      helperText={
                                        touched.fundingAgency &&
                                        errors.fundingAgency
                                      }
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid> */}
                            </TabPanel>
                            <TabPanel index={1} value={selectedTab}>
                              <Grid item xs={12} md={12}>
                                <InputLabel sx={{ mb: 1 }}>
                                  {"IFGTB Account"}
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
                                  onChange={(e, ifgtbAccount) => {
                                    setFieldValue(
                                      "ifgtbAccountId",
                                      ifgtbAccount?.value ?? ""
                                    );
                                  }}
                                  isOptionEqualToValue={(option, value) =>
                                    option.value === value.value
                                  }
                                  style={{ width: "100%" }}
                                  id="ifgtbAccountId"
                                  defaultValue={
                                    ifgtbAccounts.find(
                                      (ifgtbAccount) =>
                                        ifgtbAccount.value ===
                                        values.ifgtbAccountId
                                    ) ?? null
                                  }
                                  options={ifgtbAccounts}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select IFGTB Account"
                                      error={
                                        touched.ifgtbAccountId &&
                                        Boolean(errors.ifgtbAccountId)
                                      }
                                      helperText={
                                        touched.ifgtbAccountId &&
                                        errors.ifgtbAccountId
                                      }
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                            </TabPanel>
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
