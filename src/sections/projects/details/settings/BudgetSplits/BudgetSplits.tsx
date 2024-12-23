import { Autocomplete, Box, FormHelperText, Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { FormikHelpers, useFormik } from 'formik';
import React from 'react';
import { InputLabel } from '@mui/material';
import { Stack } from '@mui/material';
import { TextField } from '@mui/material';
import { useCreateProjectBudget, useGetProjectBudgetList, useGetProjectFinancialYear } from 'api/project';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { budgetInitialValues, formateProjectBudgetPayload, IBudgetInitialValuesProps, validationSchema } from './utils';
import { useGetAccountHeadCommon } from 'api/voucher';
import { AutoCompleteComponentProps } from 'sections/projects/add-project/utils';
import { FormControl } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { AddCircle } from 'iconsax-react';
import BudgetTable from './BudgetTable';
import LoadingButton from 'components/@extended/LoadingButton';
import { useGetProjectDetailsContext } from 'pages/projects/utils';

function BudgetSplits() {
  const { project } = useGetProjectDetailsContext();
  const { loading: isLoading, projectBudgets, refetch: getProjectBudgets } = useGetProjectBudgetList(project!.id);
  const { isLoading: isCreatingBudget, createProjectBudget } = useCreateProjectBudget();
  const { accountHeads, accountHeadLoading } = useGetAccountHeadCommon();
  const { financialYears } = useGetProjectFinancialYear(project!.id);
  const updateProjectBudget = async (values: IBudgetInitialValuesProps, { resetForm }: FormikHelpers<IBudgetInitialValuesProps>) => {
    const formatedValues = await formateProjectBudgetPayload(values, project!.id);
    await createProjectBudget(formatedValues, {
      onSuccess(response) {
        if (response?.data?.result) {
          getProjectBudgets();
          // Success response
          openSnackbar({
            open: true,
            message: response?.data?.message,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            }
          } as SnackbarProps);
          resetForm();
        } else if (Array.isArray(response?.data) && response?.data?.length > 0) {
          // Handling validation errors
          const errorMessages = response?.data?.map((err) => err.msg).join(', ');
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
      onError(error: any) {
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
    });
  };

  const { getFieldProps, values, errors, touched, handleSubmit, handleBlur, handleChange, setFieldValue } =
    useFormik<IBudgetInitialValuesProps>({
      initialValues: budgetInitialValues,
      validationSchema: validationSchema,
      validateOnMount: false,
      onSubmit: updateProjectBudget
    });
  return (
    <Grid item xs={12} md={12}>
      <MainCard
        title="Budget Splits"
        subheader={
          <Grid container spacing={3} mt={0.2} alignItems={'center'}>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ mb: 1 }}>{'Account Head'}</InputLabel>
              <Autocomplete
                limitTags={8}
                loading={accountHeadLoading}
                id="multiple-limit-tags"
                defaultValue={accountHeads.find((accountHead: any) => accountHead?.values === values.accountHead)}
                fullWidth
                options={accountHeads as any}
                onChange={(e: any, selectedValues) => {
                  setFieldValue('accountHead', selectedValues?.value);
                }}
                title="Account Head"
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Account Head"
                    error={touched.accountHead && Boolean(errors.accountHead)}
                    helperText={touched.accountHead && errors.accountHead}
                  />
                )}
                sx={AutoCompleteComponentProps}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ mb: 1 }}>{'Financial Year'}</InputLabel>
              <FormControl sx={{ width: '100%', height: '100%' }}>
                <Select
                  displayEmpty
                  placeholder="Select Financial Year"
                  name="financialYear"
                  value={values.financialYear}
                  onBlur={handleBlur}
                  fullWidth
                  onChange={handleChange}
                  error={touched.financialYear && Boolean(errors.financialYear)}
                >
                  <MenuItem value="0">Select Financial Year</MenuItem>
                  {[...financialYears].map((fYear) => (
                    <MenuItem value={fYear.value}>{fYear.label}</MenuItem>
                  ))}
                </Select>
                {touched.financialYear && Boolean(errors.financialYear) && (
                  <FormHelperText error={touched.financialYear && Boolean(errors.financialYear)}>{errors.financialYear}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack spacing={1}>
                <InputLabel htmlFor="amount">Amount</InputLabel>
                <TextField
                  fullWidth
                  type="number"
                  id="amount"
                  placeholder="Enter Amount"
                  {...getFieldProps('amount')}
                  error={Boolean(touched.amount && errors.amount)}
                  helperText={touched.amount && errors.amount}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={1}>
              <Box>
                <LoadingButton
                  shape="square"
                  loading={isCreatingBudget}
                  onClick={() => handleSubmit()}
                  variant="contained"
                  sx={{ mt: 3 }}
                  size="large"
                >
                  <AddCircle />
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        }
      >
        <BudgetTable budgets={projectBudgets} financialYears={financialYears} loading={isLoading} />
      </MainCard>
    </Grid>
  );
}

export default BudgetSplits;
