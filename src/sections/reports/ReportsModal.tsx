import {
  Autocomplete,
  Button,
  CardActions,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  LinearProgress,
  Select,
  TextField
} from '@mui/material';
import Modal from '@mui/material/Modal';

// project imports
import MainCard from 'components/MainCard';
import { useFormikContext } from 'formik';
import { IReportFormInitialValuesProps } from 'pages/reports/utils';
import { IReportLayoutChild, IReportsLayout, reportsMonthsData, reportsMonthsRangeData, reportsYearsData } from '../../data/reports';
import { useMemo } from 'react';
import { MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Stack } from '@mui/material';
import dayjs from 'dayjs';
// types

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  projects: any[];
  selectedLayout: IReportsLayout;
  selectedReport: IReportLayoutChild;
  loading: boolean;
  financialYears: {
    label: string;
    value: string;
  }[];
  isDownloadInProgress: boolean;
}

export default function ReportsModal({
  open,
  modalToggler,
  projects,
  financialYears,
  loading,
  selectedLayout,
  selectedReport,
  isDownloadInProgress = true
}: Props) {
  const closeModal = () => modalToggler(false);
  const { values, setFieldValue, touched, errors, handleBlur, handleChange, handleSubmit } =
    useFormikContext<IReportFormInitialValuesProps>();

  const monthData = useMemo(
    () => (selectedReport?.hasMonthRange ? reportsMonthsRangeData : reportsMonthsData),
    [selectedReport?.hasMonthRange]
  );
  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-project-add-label"
          aria-describedby="modal-project-add-description"
          sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
        >
          <>
            {loading && (
              <LinearProgress sx={{ borderRadius: 0 }} variant="indeterminate" color={isDownloadInProgress ? 'success' : 'primary'} />
            )}
            <MainCard
              sx={{
                width: `calc(100% - 48px)`,
                minWidth: 340,
                maxWidth: 500,
                height: 'auto',
                maxHeight: 'calc(100vh - 48px)'
              }}
              modal
              title={selectedLayout?.title}
              subheader={selectedReport?.label}
            >
              {isDownloadInProgress}
              <Grid container>
                {selectedReport?.hasProjectId && (
                  <Grid item xs={12} md={12}>
                    <InputLabel sx={{ mb: 1 }}>{'Project Code'}</InputLabel>
                    <Autocomplete
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '48px',
                          minWidth: '250px',
                          maxWidth: 'auto'
                        },
                        '& .MuiOutlinedInput-root': {
                          padding: 0
                        },
                        '& .MuiAutocomplete-inputRoot': {
                          padding: '0 14px'
                        }
                      }}
                      onChange={(_e, project) => {
                        setFieldValue('projectId', project?.value ?? '');
                      }}
                      defaultValue={projects.find((project) => project.value === values.projectId) ?? null}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      style={{ width: '100%' }}
                      id="projectId"
                      options={projects}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={touched.projectId && Boolean(errors.projectId)}
                          helperText={touched.projectId && errors.projectId}
                          name="projectId"
                          placeholder="Project Code"
                        />
                      )}
                    />
                  </Grid>
                )}

                {selectedReport?.hasMonth && (
                  <Grid item xs={12} mt={2}>
                    <InputLabel sx={{ mb: 1 }}>{`Select Month ${selectedReport?.hasMonthRange ? 'Range' : ''}`}</InputLabel>
                    <FormControl sx={{ width: '100%', height: '100%' }}>
                      <Select
                        displayEmpty
                        placeholder="Select Month"
                        name="month"
                        value={values.month}
                        onBlur={handleBlur}
                        fullWidth
                        onChange={handleChange}
                        error={touched.month && Boolean(errors.month)}
                      >
                        <MenuItem disabled value="0">
                          Select Month
                        </MenuItem>
                        {[...monthData].map((month) => (
                          <MenuItem value={month.value}>{month.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {selectedReport?.hasYear && (
                  <Grid item xs={12} mt={2}>
                    <InputLabel sx={{ mb: 1 }}>{`Select Year`}</InputLabel>
                    <FormControl sx={{ width: '100%', height: '100%' }}>
                      <Select
                        displayEmpty
                        placeholder="Select Year"
                        name="year"
                        value={values.year}
                        onBlur={handleBlur}
                        fullWidth
                        onChange={handleChange}
                        error={touched.year && Boolean(errors.year)}
                      >
                        <MenuItem disabled value="0">
                          Select Year
                        </MenuItem>
                        {[...reportsYearsData].map((year) => (
                          <MenuItem value={year.value}>{year.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {selectedReport?.hasFinancialYear && (
                  <Grid item xs={12} mt={2}>
                    <InputLabel sx={{ mb: 1 }}>{'Financial Year'}</InputLabel>
                    <FormControl disabled={values.projectId === 0} sx={{ width: '100%', height: '100%' }}>
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
                        <MenuItem disabled value="0">
                          Select Financial Year
                        </MenuItem>
                        {[...financialYears].map((fYear) => (
                          <MenuItem value={fYear.value}>{fYear.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {selectedReport?.hasDate && (
                  <Grid item xs={12}>
                    <Grid container xs={12} mt={1} spacing={2}>
                      <Grid item xs={12} sm={6} md={6}>
                        <Stack spacing={1}>
                          <InputLabel>From Date</InputLabel>
                          <FormControl sx={{ width: '100%' }} error={Boolean(touched.fromDate && errors.fromDate)}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                format="DD-MM-YYYY"
                                value={dayjs(values.fromDate) as any}
                                // defaultValue={dayjs(values.fromDate).format('YYYY-MM-DD')}
                                onChange={(newValue: string | null) => setFieldValue('fromDate', newValue)}
                              />
                            </LocalizationProvider>
                          </FormControl>
                        </Stack>
                        {touched.fromDate && errors.fromDate && <FormHelperText error={true}>{errors.fromDate as string}</FormHelperText>}
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <Stack spacing={1}>
                          <InputLabel>End Date</InputLabel>
                          <FormControl sx={{ width: '100%' }} error={Boolean(touched.toDate && errors.toDate)}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={dayjs(values.toDate) as any}
                                format="DD-MM-YYYY"
                                onChange={(newValue: string | null) => setFieldValue('toDate', newValue)}
                              />
                            </LocalizationProvider>
                          </FormControl>
                        </Stack>
                        {touched.toDate && errors.toDate && <FormHelperText error={true}>{errors.toDate as string}</FormHelperText>}
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <CardActions sx={{ justifyContent: 'flex-end', mt: 1 }}>
                <Button onClick={() => !loading && handleSubmit()} variant="contained" color="primary">
                  {loading ? 'Loading..' : 'Download'}
                </Button>
              </CardActions>
            </MainCard>
          </>
        </Modal>
      )}
    </>
  );
}
