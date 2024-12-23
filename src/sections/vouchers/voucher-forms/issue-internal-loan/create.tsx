/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from "react";

import MainCard from "components/MainCard";
import { openSnackbar } from "api/snackbar";
import {
  useCreateInternalLoanVoucher,
  useGetAccountHead,
  useGetEmployeeList,
  useGetProjectList,
} from "api/voucher";

import { Formik } from "formik";

import {
  Autocomplete,
  Grid,
  InputLabel,
  TextField,
  Button,
  CardActions,
} from "@mui/material";

// utils
import {
  initialValues,
  InitialValues,
  formateCreateVoucherPayload,
  validationSchema,
} from "./utils";

import { SnackbarProps } from "types/snackbar";
import VoucherCardTitle from "../components/voucher-card-title";
import { ReactFilesPreview } from "sections/projects/add-project/FilePicker/ReactFilesPreview";
// ==============================|| Account Voucher - ADD Voucher ||============================== //

export default function IssueInternalLoanVoucher() {
  const { projects } = useGetProjectList();

  const { createVoucher, isLoading: isCreatingVoucher } =
    useCreateInternalLoanVoucher(
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

  const handleSubmit = async (
    values: InitialValues,
    actions: { resetForm: () => void }
  ) => {
    try {
      const formatedValues = await formateCreateVoucherPayload(values);
      if (formatedValues) {
        await createVoucher(formatedValues as any);
        actions.resetForm();
        actions.resetForm();
      }
    } catch (error) {
      console.error("Error creating voucher", error);
    }
  };

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
          } = formikProps;
          const files = useMemo(() => values.projectFiles, [values]);
          return (
            <MainCard
              title={
                <VoucherCardTitle
                  voucherType="Advance Management"
                  titleText="Issue Internal Loan"
                ></VoucherCardTitle>
              }
            >
              <Grid container spacing={2} px={2}>
                <Grid item xs={12} sm={6} p={2}>
                  <Grid container spacing={1} direction="column">
                    {/* Project Code */}
                    <Grid item xs={12} md={12}>
                      <InputLabel sx={{ mb: 1 }}>{"From Project"}</InputLabel>
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
                          setFieldValue("fromProjectId", project?.value ?? "");
                        }}
                        defaultValue={
                          projects.find(
                            (project) => project.value === values.fromProjectId
                          ) ?? null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        style={{ width: "100%" }}
                        id="fromProjectId"
                        options={projects}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={
                              touched.fromProjectId &&
                              Boolean(errors.fromProjectId)
                            }
                            helperText={
                              touched.fromProjectId && errors.fromProjectId
                            }
                            name="fromProjectId"
                            placeholder="From Project"
                          />
                        )}
                      />
                    </Grid>
                    {/* Project Code */}
                    {/* To Project */}
                    <Grid item xs={12} md={12}>
                      <InputLabel sx={{ mb: 1 }}>{"Project Code"}</InputLabel>
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
                          setFieldValue("toProjectId", project?.value ?? "");
                        }}
                        defaultValue={
                          projects.find(
                            (project) => project.value === values.toProjectId
                          ) ?? null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        style={{ width: "100%" }}
                        id="toProjectId"
                        options={projects}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={
                              touched.toProjectId && Boolean(errors.toProjectId)
                            }
                            helperText={
                              touched.toProjectId && errors.toProjectId
                            }
                            name="toProjectId"
                            placeholder="To Project"
                          />
                        )}
                      />
                    </Grid>
                    {/* To Project */}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container direction="column" spacing={1}>
                    {[
                      {
                        id: 2,
                        label: "Letter No / Ref No",
                        field: "letterReferenceNo",
                        type: "text",
                      },
                      {
                        id: 4,
                        label: "Loan Amount",
                        field: "loanAmount",
                        type: "number",
                      },
                    ].map((field: any) => {
                      const value =
                        values[field.field as keyof typeof initialValues];
                      return (
                        <Grid item xs={12}>
                          <InputLabel sx={{ mb: 1 }}>{field.label}</InputLabel>
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
                <Grid item xl={12} xs={12} p={0} mt={-2} mb={2}>
                  <InputLabel sx={{ mb: 1 }}>{"Narration"}</InputLabel>
                  <TextField
                    id="narration"
                    name="narration"
                    placeholder={`Narration`}
                    type={"text"}
                    value={values.narration}
                    error={touched.narration && Boolean(errors.narration)}
                    helperText={touched.narration && errors.narration}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  />
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
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  onClick={() => handleSubmit()}
                  variant="contained"
                  color="primary"
                >
                  {isCreatingVoucher ? "Loading.." : "Save"}
                </Button>
                <Button variant="outlined" color="secondary">
                  Cancel
                </Button>
              </CardActions>
            </MainCard>
          );
        }}
      </Formik>
    </>
  );
}
