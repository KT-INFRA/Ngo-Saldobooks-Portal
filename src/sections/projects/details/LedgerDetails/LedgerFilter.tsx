// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

// project-imports
import MainCard from 'components/MainCard';
import { useGetProjectFinancialYear } from 'api/project';
import { useFormikContext } from 'formik';
import { FormControl, FormHelperText } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { memo } from 'react';
import { useGetProjectDetailsContext } from 'pages/projects/utils';
import { IFilterInitialValues } from './utils';

export function LedgerFilter() {
  const { project } = useGetProjectDetailsContext()!;
  const { financialYears } = useGetProjectFinancialYear(project!.id);

  const { values, errors, touched, handleChange, setFieldValue, handleBlur, resetForm } = useFormikContext<IFilterInitialValues>();
  const isClear = values.financialYear || values.fromDate || values.toDate;

  return (
    <MainCard border={true} shadow={true}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel sx={{ mb: 1 }}>{'Financial Year'}</InputLabel>
          <FormControl sx={{ width: '100%', height: '100%' }}>
            <Select
              displayEmpty
              placeholder="Select Financial Year"
              name="financialYear"
              value={values.financialYear}
              onBlur={handleBlur}
              onChange={handleChange}
            >
              <MenuItem disabled value="0">
                Select Financial Year
              </MenuItem>
              {[...financialYears].map((year) => (
                <MenuItem value={year.value}>{year.label}</MenuItem>
              ))}
            </Select>
            {touched.financialYear && Boolean(errors.financialYear) && (
              <FormHelperText error={Boolean(errors.financialYear)}>{errors.financialYear}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Stack spacing={1}>
            <InputLabel>From Date</InputLabel>
            <FormControl sx={{ width: '100%' }} error={Boolean(touched.fromDate && errors.fromDate)}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker format="dd/MM/yyyy" value={values.fromDate} onChange={(newValue) => setFieldValue('fromDate', newValue)} />
              </LocalizationProvider>
            </FormControl>
          </Stack>
          {touched.fromDate && errors.fromDate && <FormHelperText error={true}>{errors.fromDate as string}</FormHelperText>}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Stack spacing={1}>
            <InputLabel>To Date</InputLabel>
            <FormControl sx={{ width: '100%' }} error={Boolean(touched.toDate && errors.toDate)}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  disabled={Boolean(!values.fromDate)}
                  format="dd/MM/yyyy"
                  value={values.toDate}
                  onChange={(newValue) => setFieldValue('toDate', newValue)}
                />
              </LocalizationProvider>
            </FormControl>
          </Stack>
          {touched.toDate && errors.toDate && <FormHelperText error={true}>{errors.toDate as string}</FormHelperText>}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Stack spacing={1}>
            <InputLabel></InputLabel>
            <FormControl sx={{ width: '100%' }}>
              <Stack direction={'row'} gap={2} mt={2.5}>
                {isClear && (
                  <Button
                    onClick={() => {
                      resetForm();
                    }}
                    size="large"
                    color={'error'}
                    variant="outlined"
                  >
                    {'Clear'}
                  </Button>
                )}
              </Stack>
            </FormControl>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default memo(LedgerFilter);
