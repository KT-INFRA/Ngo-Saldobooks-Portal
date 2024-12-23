import { Accordion, AccordionDetails, Grid, Stack } from '@mui/material';
import { AccordionSummary, useTheme } from '@mui/material';
import MainCard from 'components/MainCard';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { InputLabel } from '@mui/material';
import dayjs from 'dayjs';
import { FormikErrors } from 'formik';
import { Button } from '@mui/material';
import { Setting2, TickCircle } from 'iconsax-react';
import PayslipTable from './PayslipTable';
import LoadingButton from 'components/@extended/LoadingButton';
//import { GeneratePayBillResponse } from 'types/payroll';
import { GeneratePayBillResponseNew } from 'types/payroll';
import { useGetGeneratepayBill } from 'api/payroll';
import { useEffect, useState} from 'react';

type GenerateFormProps = {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<FormikErrors<any>> | Promise<void>;
  voucherDate: string;
  error: string;
  month: number;
  year: number;
  // data: GeneratePayBillResponse;
  data: GeneratePayBillResponseNew;
  loading: boolean;
  handleRefetch: () => void;
};

function GenerateForm({ setFieldValue, handleRefetch, voucherDate, month, year, data, loading }: GenerateFormProps) {
  // console.log('data2');
  console.log('data2', data?.data?.pay_category);
  const { updateGeneratepaybill } = useGetGeneratepayBill();
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateClick = async () => {
    const payCategory = data?.data?.pay_category;

    if (payCategory) {
      console.log(payCategory);

      const filteredIds = payCategory
        .filter((item) => !item.is_generated)
        .map((item) => item.id);

      console.log(filteredIds);
      const date = data?.data?.date; 

      // if (filteredIds.length > 0) {
      //   updateGeneratepaybill({ employee_ids: filteredIds, date: date });
      //   alert('Successfully Generated')
      //   setError(''); 
      // } 
    
      if (filteredIds.length > 0) {
        try {
          const response = await updateGeneratepaybill({ employee_ids: filteredIds, date: date });
          console.log(response);
          alert('Successfully Generated');
          setError(''); 
        } catch (error) {
          console.error(error);
          alert('Failed to Generate. Please try again.');
        }
      }
      else {
        setError('Already Generated'); 
        alert('Already Generated');
      }
    }
  };


  
  const theme = useTheme();
  return (
    <MainCard title="Generate Pay bill" border={false} shadow={theme.customShadows.z1} sx={{ height: '100%' }}>
      <Accordion
        style={{
          borderWidth: 0,
          backgroundColor: 'transparent'
        }}
        expanded={true}
      >
        <AccordionSummary
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            borderWidth: 0
          }}
          expandIcon={null}
        >
          <Grid container gap={3}>
            <Grid item xs={12} md={4} xl={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <InputLabel sx={{ mb: 1 }}>{'Select Month'}</InputLabel>
                <Stack>
                  <MobileDatePicker
                    views={['month']}
                    format={'MMMM'}
                    value={new Date(month)}
                    onChange={(date) => {
                      // alert(date);
                      //  setFieldValue('voucherDate', dayjs(date).format('YYYY-MM-DD'));
                      setFieldValue('month', dayjs(date).format('YYYY-MM-DD'));
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <InputLabel sx={{ mb: 1 }}>{'Select Year'}</InputLabel>
                <Stack>
                  <MobileDatePicker
                    views={['year']}
                    format={'yyyy'}
                    value={new Date(year)}
                    onChange={(date) => {
                      // alert(date);
                      // setFieldValue('voucherDate', dayjs(date).format('YYYY-MM-DD'));
                      setFieldValue('year', dayjs(date).format('YYYY-MM-DD'));
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <Stack mt={3.5}>
                <LoadingButton
                  onClick={() => {
                    if (!loading) {
                      handleRefetch();
                    }
                  }}
                  loading={loading}
                  size="large"
                  color="primary"
                  variant="contained"
                  shape="square"
                >
                  <TickCircle />
                </LoadingButton>
              </Stack>
            </Grid>
            <Grid>
              <Stack mt={3.5}>
                <Button onClick={handleGenerateClick}  variant="contained" size="large" color={'primary'} startIcon={<Setting2 />}>
                  {'Generate'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <PayslipTable loading={loading} paySlipsData={data?.data?.pay_category || []} />
        </AccordionDetails>
      </Accordion>
    </MainCard>
  );
}

export default GenerateForm;
