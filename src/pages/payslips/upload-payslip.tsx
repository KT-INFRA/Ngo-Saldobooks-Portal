import React, { Suspense, SyntheticEvent, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { useFormik } from 'formik';
import { DocumentText, DocumentUpload } from 'iconsax-react';
import dayjs from 'dayjs';
import { useGetGeneratePayBill, useUploadPayBill, useValidatePayBill } from 'api/payroll';
import { convertFileToBase64 } from 'sections/payslips/payslip-upload/utils';
import UploadPaySlipAlert from 'sections/payslips/UploadPaySlipAlert';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { Tabs } from '@mui/material';
import { Tab } from '@mui/material';
import { getUserModuleData, SubModuleEnum, UserModuleEnum } from 'utils/modules';
import { UserModule } from 'types/auth';

const UploadForm = React.lazy(() => import('sections/payslips/payslip-upload/UploadForm'));
const GenerateForm = React.lazy(() => import('sections/payslips/payslip-generate/GenerateForm'));

const uploadPayBillExcel = getUserModuleData(UserModuleEnum.Payroll, SubModuleEnum.Payroll.UploadPayBillExcel)! as UserModule;
const generatePayslip = getUserModuleData(UserModuleEnum.Payroll, SubModuleEnum.Payroll.GeneratePayslip)! as UserModule;

export default function UploadPayslip() {
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { values, handleChange, touched, errors, setFieldValue } = useFormik<any>({
    initialValues: {
      voucherDate: new Date(),
      voucher: 0,
      description: '',
      activeStep: 0,
      isValidated: false,
      file: null,
      month: new Date(),
      year: new Date()
    },
    onSubmit: (values) => {}
  });

  const { mutateAsync: validateFile, isPending } = useValidatePayBill();
  const { mutateAsync: uploadFile, isPending: isUploding } = useUploadPayBill();
  const [openUpload, setOpenUpload] = useState(false);

  const {
    data,
    isLoading: isLoadingGenerate,
    refetch,
    isRefetching: isRefetchingGenerate
  } = useGetGeneratePayBill({
    month: +dayjs(values.month).format('M'),
    year: +dayjs(values.year).format('YYYY')
  });

  const handleRefetch = () => {
    refetch();
  };

  useEffect(() => {
    handleRefetch();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setFieldValue('activeStep', newValue);
  };

  const handleClose = () => {
    setOpenUpload(false);
    setFieldValue('file', null);
  };

  const handleValidateFile = async () => {
    const base64 = await convertFileToBase64(values.file);
    await validateFile(
      { payroll_file: base64, business_id: 1, date: dayjs(values.voucherDate).format('YYYY-MM-DD') },
      {
        onError: (error) => {
          setError(error?.message);
          setFieldValue('isValidated', false);
          openSnackbar({
            open: true,
            message: error?.message,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'error'
            }
          } as SnackbarProps);
        },
        onSuccess: ({ data }) => {
          setFieldValue('isValidated', true);
          openSnackbar({
            open: true,
            message: data?.message,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            }
          } as SnackbarProps);
          // setShowData(true);
          // setPayslipsData(data);
        }
      }
    );
  };
  const handleUploadFile = async () => {
    const base64 = await convertFileToBase64(values.file);
    await uploadFile(
      {
        payroll_file: base64,
        description: values.description,
        business_id: 1,
        created_by: 1,
        date: dayjs(values.voucherDate).format('YYYY-MM-DD')
      },
      {
        onError: (error) => {
          setError(error?.message);
          openSnackbar({
            open: true,
            message: error?.message,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'error'
            }
          } as SnackbarProps);
        },
        onSuccess: ({ data }) => {
          setFieldValue('month', new Date().setMonth(new Date(values.voucherDate).getMonth()));
          setFieldValue('year', new Date().setFullYear(new Date(values.voucherDate).getFullYear()));
          setFieldValue('activeStep', 1);
          handleRefetch();
          handleClose();
          openSnackbar({
            open: true,
            message: 'PayRollExcel data and EmployeePayRollDetails saved successfully.',
            // message: data?.message,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            }
          } as SnackbarProps);
        }
      }
    );
  };

  return (
    <>
      <Stack>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs
            value={values.activeStep}
            onChange={handleChangeTab}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="account profile tab"
          >
            <Tab disabled={uploadPayBillExcel?.access === false} label="Upload" icon={<DocumentUpload />} iconPosition="start" />
            <Tab disabled={generatePayslip?.access === false} label="Generate" icon={<DocumentText />} iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          <Suspense>
            {values.activeStep === 0 && uploadPayBillExcel?.access ? (
              <UploadForm setOpenUpload={setOpenUpload} setFieldValue={setFieldValue} voucherDate={values.voucherDate} error={error} />
            ) : null}
            {values.activeStep === 1 && generatePayslip?.access ? (
              <GenerateForm
                data={data?.data?.data}
                loading={isLoadingGenerate || isRefetchingGenerate}
                setFieldValue={setFieldValue}
                voucherDate={values.voucherDate}
                error={error}
                month={values.month}
                year={values.year}
                handleRefetch={handleRefetch}
              />
            ) : null}
          </Suspense>
        </Box>
        <UploadPaySlipAlert
          file={values.file}
          setFieldValue={setFieldValue}
          handleValidateFile={handleValidateFile}
          handleUploadFile={handleUploadFile}
          isValidated={values.isValidated}
          error={error}
          isLoading={isPending || isUploding}
          open={openUpload}
          handleClose={handleClose}
        />
      </Stack>
    </>
  );
}
