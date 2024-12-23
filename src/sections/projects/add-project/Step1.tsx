import React from 'react';
import { Autocomplete, InputLabel, ListItem, ListItemIcon, Switch } from '@mui/material';
import { Stack } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { InitialValues } from './utils';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Clock } from 'iconsax-react';
import { Typography } from '@mui/material';
import { ListItemText } from '@mui/material';

// type FormikType = ReturnType<typeof useFormik>;

type SelectItemType = { label: string; value: number };
interface Step1Props {
  employees: SelectItemType[];
  fundingAgencies: SelectItemType[];
}

function Step1({ employees, fundingAgencies }: Step1Props) {
  const { getFieldProps, touched, values, errors, setFieldValue } = useFormikContext<InitialValues>();

  return (
    <Grid container mt={2} spacing={3}>
      <Grid item xs={12} md={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="projectCode">Project Code</InputLabel>
              <TextField
                fullWidth
                id="projectCode"
                placeholder="Project Code"
                {...getFieldProps('projectCode')}
                error={Boolean(touched.projectCode && errors.projectCode)}
                helperText={touched.projectCode && errors.projectCode}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="projectTitle">Project Title</InputLabel>
              <TextField
                fullWidth
                id="projectTitle"
                placeholder="Enter Project Title"
                {...getFieldProps('projectTitle')}
                error={Boolean(touched.projectTitle && errors.projectTitle)}
                helperText={touched.projectTitle && errors.projectTitle}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel sx={{ mb: 1 }}>{'Project PI'}</InputLabel>
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
              onChange={(_e, employee) => {
                setFieldValue('projectPI', employee?.value ?? '');
              }}
              defaultValue={employees.find((employee) => employee.value === values.projectPI) ?? null}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              style={{ width: '100%' }}
              id="projectPI"
              options={employees}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="projectPI"
                  placeholder="Project PI"
                  error={touched.projectPI && Boolean(errors.projectPI)}
                  helperText={touched.projectPI && errors.projectPI}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel sx={{ mb: 1 }}>{'Funding Agency'}</InputLabel>
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
              onChange={(_e, fundingAgency) => {
                setFieldValue('fundingAgency', fundingAgency?.value ?? '');
              }}
              defaultValue={fundingAgencies.find((fundingAgency) => fundingAgency.value === values.fundingAgency) ?? null}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              style={{ width: '100%' }}
              id="fundingAgency"
              options={fundingAgencies}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="fundingAgency"
                  placeholder="Funding Agency"
                  error={touched.fundingAgency && Boolean(errors.fundingAgency)}
                  helperText={touched.fundingAgency && errors.fundingAgency}
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <InputLabel sx={{ mb: 1 }}>Project Start</InputLabel>
              <Stack>
                <MobileDatePicker
                  format={'dd/MM/yyyy'}
                  views={['day', 'month', 'year']}
                  value={new Date(values.projectStart)}
                  onChange={(date) => {
                    setFieldValue('projectStart', dayjs(date).format('YYYY-MM-DD'));
                  }}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <Stack my={1}>
              <ListItem>
                <ListItemIcon sx={{ color: 'primary.main', mr: 2, display: { xs: 'none', sm: 'block' } }}>
                  <Clock variant="Broken" />
                </ListItemIcon>
                <ListItemText
                  id="switch-list-label-oc"
                  primary={<Typography variant="h5">On Going Project?</Typography>}
                  secondary="Is this project is on going project"
                />
                <Switch
                  edge="end"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>, checked) => setFieldValue('isOnGoing', checked)}
                  checked={values.isOnGoing}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-oc'
                  }}
                />
              </ListItem>
            </Stack>
          </Grid>

          {!values.isOnGoing && (
            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="project-duration">Project Duration (Months)</InputLabel>
                <TextField
                  type="number"
                  fullWidth
                  id="project-duration"
                  placeholder="Enter Duration"
                  {...getFieldProps('projectDuration')}
                  error={Boolean(touched.projectDuration && errors.projectDuration)}
                  helperText={touched.projectDuration && errors.projectDuration}
                />
              </Stack>
            </Grid>
          )}
          {!values.isOnGoing && (
            <Grid item xs={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="projectApprovedBudget">Project Approved Budget:</InputLabel>
                <TextField
                  type="number"
                  fullWidth
                  id="projectApprovedBudget"
                  placeholder="Project Approved Budget"
                  {...getFieldProps('projectApprovedBudget')}
                  error={Boolean(touched.projectApprovedBudget && errors.projectApprovedBudget)}
                  helperText={touched.projectApprovedBudget && errors.projectApprovedBudget}
                />
              </Stack>
            </Grid>
          )}
          {/* <Grid item xs={12}>
            <DocumentsPicker />
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step1;
