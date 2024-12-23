import { Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { InputLabel } from '@mui/material';
import { Stack } from '@mui/material';
import { TextField } from '@mui/material';
import LoadingButton from 'components/@extended/LoadingButton';
import MainCard from 'components/MainCard';
import { ISettleInitialValuesProps } from './SettleInternalLoanModal';
// import { useViewInternalLoanContext } from 'pages/vouchers/view-internal-loan/view-internal-loan-context';
import { formateCurrency } from 'utils/currency';

export interface ISettleFormProps {
  handleSubmit: () => void;
  isLoading?: boolean;
}
function SettleLoanForm({ isLoading, handleSubmit }: ISettleFormProps) {
  const { errors, getFieldProps, touched, values } = useFormikContext<ISettleInitialValuesProps>();
  return (
    <MainCard
      title="Settle Loan"
      content={true}
      sx={{ mt: 1 }}
      secondary={
        <Stack direction={'row'} gap={1}>
          <Typography>Loan Amount</Typography>
          <Typography variant="h5" color={'primary'}>
            {formateCurrency(values?.loanAmount)}
          </Typography>
        </Stack>
      }
    >
      <Grid item xs={12} md={12}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} md={3}>
            <Stack spacing={1}>
              <InputLabel htmlFor="amount">Amount</InputLabel>
              <TextField
                fullWidth
                id="amount"
                placeholder="Enter Amount"
                {...getFieldProps('amount')}
                error={Boolean(touched.amount && errors.amount)}
                helperText={touched.amount && errors.amount}
                inputProps={{ min: 0 }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={1}>
              <InputLabel htmlFor="letterRefNo">Letter Reference No</InputLabel>
              <TextField
                fullWidth
                id="letterRefNo"
                placeholder="Letter/Reference No"
                {...getFieldProps('letterRefNo')}
                error={Boolean(touched.letterRefNo && errors.letterRefNo)}
                helperText={touched.letterRefNo && errors.letterRefNo}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack justifyContent={'center'} alignItems={'center'} sx={{ mt: 3 }}>
              <LoadingButton loading={isLoading} onClick={() => handleSubmit()} size="large" variant="contained">
                Settle Internal Loan
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default SettleLoanForm;
