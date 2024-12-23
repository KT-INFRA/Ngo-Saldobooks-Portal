import { useMemo, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// assets
import { Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ReportCard from 'sections/reports/ReportCard';
import { IReportLayoutChild, IReportsLayout, reportsLayouts } from 'data/reports';
import { ChartSquare } from 'iconsax-react';
import ReportsModal from 'sections/reports/ReportsModal';
import { FormikProvider, useFormik } from 'formik';
import { createDynamicSchema, IReportFormInitialValuesProps, reportFormInitialValues } from './utils';
import { useGetProjectList } from 'api/voucher';
import { useDownloadReport, useGetProjectFinancialYear } from 'api/reports';
import * as Yup from 'yup';
export default function Reports() {
  const [open, setOpen] = useState<boolean>(false);
  const { projects } = useGetProjectList();
  const formik = useFormik<IReportFormInitialValuesProps>({
    initialValues: reportFormInitialValues,
    validateOnMount: true,
    enableReinitialize: true,
    // validate: customeValidate,
    validationSchema: () => {
      return Yup.lazy(createDynamicSchema);
    },
    onSubmit: async () => downloadReport()
  });
  const { values, setValues, setTouched, setErrors, setFieldValue } = formik;

  const selectedLayout = useMemo(() => reportsLayouts.filter((report) => report.id === values.selectedLayout), [values.selectedLayout])[0];
  const selectedReport = useMemo(
    () => selectedLayout?.children?.find((report) => report.key === values.selectedReport),
    [selectedLayout?.children, values.selectedReport]
  );

  const { financialYears = [] } = useGetProjectFinancialYear(values.projectId);
  const { loading, mutateAsync: downloadReport, isInProgress } = useDownloadReport(values, selectedReport!);

  const layouts = useMemo(() => reportsLayouts, []);
  //console.log(layouts);

  const handleResetField = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selectedLayout, ...rest } = reportFormInitialValues;
    setValues({ ...reportFormInitialValues, ...rest });
    setTouched({});
    setErrors({});
    return Promise.resolve();
  };

  const handlePress = (report: IReportLayoutChild) => {
    setOpen(true);
    setFieldValue('selectedReport', report.key);
  };
  const handleUpdateSelectedLayout = async (layout: IReportsLayout) => {
    setOpen(true);
    await handleResetField();
    setFieldValue('selectedLayout', layout.id);
  };
  return (
    <FormikProvider value={formik}>
      <Grid container spacing={3}>
        <MainCard sx={{ mt: 2, backgroundColor: 'transparent', border: 'none' }}>
          {layouts?.map((report: IReportsLayout, index: number) => (
            <Stack>
              <Stack
                gap={1}
                direction="row"
                alignItems={'center'}
                mb={2}
                borderRadius={0.5}
                sx={{
                  textTransform: 'uppercase'
                }}
              >
                <Typography color={'primary.main'}>
                  <ChartSquare />
                </Typography>
                <Typography variant="h5">{report.title}</Typography>
              </Stack>
              <Grid container spacing={3} mb={3}>
                {report?.children
                  ?.filter((_) => _.enabled)
                  .map((item: IReportLayoutChild) => {
                    return (
                      <Grid item xs={12} md={4}>
                        <ReportCard
                          report={item}
                          handlePress={() => {
                            handleUpdateSelectedLayout(report);
                            handlePress(item);
                          }}
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            </Stack>
          ))}
        </MainCard>
      </Grid>
      <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        <ReportsModal
          financialYears={financialYears}
          loading={loading}
          projects={projects}
          modalToggler={() => setOpen(false)}
          open={open}
          isDownloadInProgress={isInProgress}
          selectedLayout={selectedLayout}
          selectedReport={selectedReport as IReportLayoutChild}
        />
      </Stack>
    </FormikProvider>
  );
}
