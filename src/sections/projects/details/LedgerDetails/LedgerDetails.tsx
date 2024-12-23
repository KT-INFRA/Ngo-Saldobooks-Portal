// material-ui
import Grid from '@mui/material/Grid';

// project-imports
import { useGetProjectLedgersByFinancialYear } from 'api/project';
import { FormikProvider, useFormik } from 'formik';
import dayjs from 'dayjs';
import { memo, useMemo } from 'react';
import LedgerTable from './LedgerTable';
import { useGetProjectDetailsContext } from 'pages/projects/utils';
import { filterInitialValues, IFilterInitialValues, ProjectLedgerContextProvider } from './utils';
import { LedgerFilter } from './LedgerFilter';

export function LedgerDetails() {
  const { project } = useGetProjectDetailsContext()!;
  const formik = useFormik<IFilterInitialValues>({
    initialValues: filterInitialValues,
    onSubmit: () => {}
  });

  const { values } = formik;

  const payload = useMemo(
    () => ({
      fromDate: values.fromDate ? dayjs(values.fromDate).format('DD-MM-YYYY') : null,
      toDate: values.toDate ? dayjs(values.toDate).format('DD-MM-YYYY') : null,
      financialYear: values.financialYear || null,
      projectId: project!.id
    }),
    [project, values.financialYear, values.fromDate, values.toDate]
  );

  const { ledgers, isLoading, handleChangePage, handleChangePageSize, meta } = useGetProjectLedgersByFinancialYear(payload);

  return (
    <ProjectLedgerContextProvider value={{ ledgers, isLoading, handleChangePage, handleChangePageSize, meta }}>
      <FormikProvider value={formik}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <LedgerFilter />
          </Grid>
          <Grid item xs={12} p={2}>
            <LedgerTable />
          </Grid>
        </Grid>
      </FormikProvider>
    </ProjectLedgerContextProvider>
  );
}

export default memo(LedgerDetails);
