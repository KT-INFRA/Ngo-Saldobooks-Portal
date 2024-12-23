import React, { SetStateAction } from 'react';
import { Grid, Stack, TextField } from '@mui/material';
import { useTheme } from '@mui/material';
import MainCard from 'components/MainCard';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { InputLabel } from '@mui/material';
import dayjs from 'dayjs';
import { FormikErrors } from 'formik';
import { Button } from '@mui/material';
import { DocumentUpload } from 'iconsax-react';

type UploadFormProps = {
  setOpenUpload: React.Dispatch<SetStateAction<boolean>>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<FormikErrors<any>> | Promise<void>;
  voucherDate: string;
  error: string;
};

function UploadForm({ setFieldValue, setOpenUpload, voucherDate }: UploadFormProps) {
  const theme = useTheme();
  return (
    <MainCard title="Upload Pay bill" border={false} shadow={theme.customShadows.z1} sx={{ height: '100%' }}>
      <Grid container gap={3}>
        <Grid item xs={12} md={3} xl={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <InputLabel sx={{ mb: 1 }}>{'Select Month / Year'}</InputLabel>
            <Stack>
              <MobileDatePicker
                views={['month', 'year']}
                format={'MM/yyyy'}
                value={new Date(voucherDate)}
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
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default UploadForm;
