import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { FormikHelpers, useFormik } from 'formik';
import { useMemo } from 'react';
import { extensionInitialValues, formateProjectExtensionPayload, IExtensionInitialValuesProps } from './utils';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { InputLabel } from '@mui/material';
import { Stack } from '@mui/material';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';
import LoadingButton from 'components/@extended/LoadingButton';
import { ReactFilesPreview } from 'sections/projects/add-project/FilePicker/ReactFilesPreview';
import { useUpdateProjectExtension } from 'api/project';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { useGetProjectDetailsContext } from 'pages/projects/utils';
import * as Yup from 'yup';

function ProjectExtension() {
  const { project } = useGetProjectDetailsContext();
  const { updateProjectExstension, isLoading: isUpdatingProject } = useUpdateProjectExtension();

  const updateProjectExtension = async (
    values: IExtensionInitialValuesProps,
    { resetForm, setFieldValue }: FormikHelpers<IExtensionInitialValuesProps>
  ) => {
    const formatedValues = await formateProjectExtensionPayload(values, project!.id);
    await updateProjectExstension(formatedValues, {
      onSuccess(response) {
        if (response?.data?.result) {
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

  const { getFieldProps, setFieldValue, values, errors, touched, handleSubmit } = useFormik<IExtensionInitialValuesProps>({
    initialValues: extensionInitialValues,
    validateOnMount: false,
    validationSchema: Yup.object().shape({
      extDuration: Yup.number().required('Extension Duration is required').min(1, 'Please enter a valid Extension Duration')
    }),
    onSubmit: updateProjectExtension
  });
  const files = useMemo(() => values.extensionFiles, [values]);
  return (
    <Grid item xs={12} md={12}>
      <MainCard
        title="Project Extension"
        secondary={
          <LoadingButton onClick={() => handleSubmit()} size="large" sx={{ margin: 0 }} loading={isUpdatingProject} variant="contained">
            Update
          </LoadingButton>
        }
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <InputLabel sx={{ mb: 1 }}>Approval Date</InputLabel>
              <Stack>
                <MobileDatePicker
                  format={'dd/MM/yyyy'}
                  views={['day', 'month', 'year']}
                  value={new Date(values.approvalDate)}
                  onChange={(date) => {
                    setFieldValue('approvalDate', dayjs(date).format('YYYY-MM-DD'));
                  }}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack spacing={1}>
              <InputLabel htmlFor="extDuration">Extension Duration (Months)</InputLabel>
              <TextField
                fullWidth
                type="number"
                id="extDuration"
                placeholder="Enter Project Duration"
                {...getFieldProps('extDuration')}
                error={Boolean(touched.extDuration && errors.extDuration)}
                helperText={touched.extDuration && errors.extDuration}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack sx={{ flex: 1 }} spacing={1}>
              <InputLabel htmlFor="extDuration">Approval Reference</InputLabel>
              <TextField
                fullWidth
                id="approvalReference"
                placeholder="Enter Reference"
                {...getFieldProps('approvalReference')}
                error={Boolean(touched.approvalReference && errors.approvalReference)}
                helperText={touched.approvalReference && errors.approvalReference}
              />
            </Stack>
          </Grid>
        </Grid>

        <Grid container py={3}>
          <ReactFilesPreview
            files={files}
            getFiles={(files) => {
              setFieldValue('extensionFiles', files);
            }}
          />
        </Grid>
      </MainCard>
    </Grid>
  );
}

export default ProjectExtension;
