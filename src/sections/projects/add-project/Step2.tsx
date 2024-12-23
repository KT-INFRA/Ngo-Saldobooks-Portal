import React from 'react';
import { InputLabel } from '@mui/material';
import { Stack } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { InitialValues } from './utils';

// type FormikType = ReturnType<typeof useFormik>;

interface Step2Props {}

// eslint-disable-next-line no-empty-pattern
function Step2({}: Step2Props) {
  const { getFieldProps, touched, errors } = useFormikContext<InitialValues>();

  return (
    <Grid container mt={2} spacing={3}>
      <Grid item xs={12} md={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="bankName">Bank Name</InputLabel>
              <TextField
                fullWidth
                id="bankName"
                placeholder="Bank Name"
                {...getFieldProps('bankName')}
                error={Boolean(touched.bankName && errors.bankName)}
                helperText={touched.bankName && errors.bankName}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="beneficiaryName">Beneficiary Name</InputLabel>
              <TextField
                fullWidth
                id="beneficiaryName"
                placeholder="Beneficiary Name"
                {...getFieldProps('beneficiaryName')}
                error={Boolean(touched.beneficiaryName && errors.beneficiaryName)}
                helperText={touched.beneficiaryName && errors.beneficiaryName}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="ifscCode">IFSC Code</InputLabel>
              <TextField
                fullWidth
                id="ifscCode"
                placeholder="IFSC Code"
                {...getFieldProps('ifscCode')}
                error={Boolean(touched.ifscCode && errors.ifscCode)}
                helperText={touched.ifscCode && errors.ifscCode}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="accountNumber">Account Number</InputLabel>
              <TextField
                fullWidth
                id="accountNumber"
                placeholder="Account Number"
                {...getFieldProps('accountNumber')}
                error={Boolean(touched.accountNumber && errors.accountNumber)}
                helperText={touched.accountNumber && errors.accountNumber}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="purpose">Purpose</InputLabel>
              <TextField
                fullWidth
                id="purpose"
                placeholder="Purpose"
                {...getFieldProps('purpose')}
                error={Boolean(touched.purpose && errors.purpose)}
                helperText={touched.purpose && errors.purpose}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step2;
