import React, { useState } from 'react';
import { InputLabel, Stack } from '@mui/material';
import { Grid, TextField, Switch, Typography, ListItemText, ListItem } from '@mui/material';
import { useFormikContext } from 'formik';
import { FieldLayout, InitialFormValues, inputlayouts1, inputlayouts2 } from './utils';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dayjs from 'dayjs';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import { useGetDivision, useGetDepartment, useGetDesignation, useGetUserTypeList } from 'api/masters';

interface Step1Props {}
// eslint-disable-next-line no-empty-pattern
function Step2({}: Step1Props) {
  const { getFieldProps, touched, errors, values, setFieldValue, handleChange } = useFormikContext<InitialFormValues>();
  const { divisionData = [] } = useGetDivision();
  const { departmentData = [] } = useGetDepartment();
  const { designationData = [] } = useGetDesignation();
  const { employeesUserTypes = [] } = useGetUserTypeList();
  const [showPermanentEmpField, setShowPermanentEmpField] = useState<boolean>(false);

  return (
    <Grid container mt={2} spacing={3}>
      <Grid item xs={12} md={12}>
        <Grid
          container
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {inputlayouts1
            .filter((_) => _?.step === 2 && _.enabled === true)
            .map((field: FieldLayout) => {
              return (
                <Grid item xs={12} sm={3.8}>
                  <InputLabel sx={{ mb: 1 }}>{field.label}</InputLabel>
                  <TextField
                    type={field.type}
                    id={field.field}
                    {...getFieldProps(field.field)}
                    placeholder={`Enter ${field.label}`}
                    error={touched[field.field as keyof InitialFormValues] && Boolean(errors[field.field as keyof InitialFormValues])}
                    helperText={touched[field.field as keyof InitialFormValues] && errors[field.field as keyof InitialFormValues]}
                    fullWidth
                  />
                </Grid>
              );
            })}
          {/* ------DEPARTMENT----- */}
          <Grid item xs={12} sm={3.8}>
            <InputLabel htmlFor="departmentId">Department</InputLabel>
            <Autocomplete
              // value={fyear}
              sx={{
                '& .MuiInputBase-root': {
                  height: '48px'
                  // minWidth: '100px',
                  // maxWidth: 'auto'
                },
                '& .MuiOutlinedInput-root': {
                  padding: 0
                },
                '& .MuiAutocomplete-inputRoot': {
                  padding: '0 14px'
                }
              }}
              onChange={(_e, project) => {
                setFieldValue('departmentId', project?.value);
                // setFyear({ label: project?.label, value: project?.value });
              }}
              multiple={false}
              defaultValue={departmentData.find((p) => p.value === values.departmentId)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              id="departmentId"
              options={departmentData}
              renderInput={(params) => (
                <TextField
                  error={touched.departmentId && Boolean(errors.departmentId)}
                  helperText={touched.departmentId && errors.departmentId}
                  name="departmentId"
                  placeholder="Department"
                  {...params}
                />
              )}
            />
          </Grid>
          {/* ------DIVISION----- */}
          <Grid item xs={12} sm={3.8}>
            <InputLabel htmlFor="payment_type_id">Division</InputLabel>
            <Autocomplete
              // value={fyear}
              sx={{
                '& .MuiInputBase-root': {
                  height: '48px'
                  // minWidth: '100px',
                  // maxWidth: 'auto'
                },
                '& .MuiOutlinedInput-root': {
                  padding: 0
                },
                '& .MuiAutocomplete-inputRoot': {
                  padding: '0 14px'
                }
              }}
              onChange={(_e, project) => {
                setFieldValue('divisionId', project?.value);
                // setFyear({ label: project?.label, value: project?.value });
              }}
              multiple={false}
              defaultValue={divisionData.find((p) => p.value === values.divisionId)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              id="divisionId"
              options={divisionData}
              renderInput={(params) => (
                <TextField
                  error={touched.divisionId && Boolean(errors.divisionId)}
                  helperText={touched.divisionId && errors.divisionId}
                  name="divisionId"
                  placeholder="Division"
                  {...params}
                />
              )}
            />
          </Grid>
          {/* ----------- */}
          {/* ------DESIGNATION----- */}
          <Grid item xs={12} sm={3.8}>
            <InputLabel htmlFor="payment_type_id">Designation</InputLabel>
            <Autocomplete
              // value={fyear}
              sx={{
                '& .MuiInputBase-root': {
                  height: '48px'
                  // minWidth: '100px',
                  // maxWidth: 'auto'
                },
                '& .MuiOutlinedInput-root': {
                  padding: 0
                },
                '& .MuiAutocomplete-inputRoot': {
                  padding: '0 14px'
                }
              }}
              onChange={(_e, project) => {
                setFieldValue('designationId', project?.value);
                // setFyear({ label: project?.label, value: project?.value });
              }}
              multiple={false}
              defaultValue={designationData.find((p) => p.value === values.designationId)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              id="designationId"
              options={designationData}
              renderInput={(params) => (
                <TextField
                  error={touched.designationId && Boolean(errors.designationId)}
                  helperText={touched.designationId && errors.designationId}
                  name="designationId"
                  placeholder="Designation"
                  {...params}
                />
              )}
            />
          </Grid>
          {/* ----------- */}
          <Grid item xs={3.8}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {/* <InputLabel sx={{ mb: 1 }}>Project Start</InputLabel> */}
              <InputLabel sx={{ mb: 1 }}>Appointment Date</InputLabel>
              <Stack>
                <MobileDatePicker
                  format={'dd/MM/yyyy'}
                  value={new Date(values.appointmentDate)}
                  onChange={(date) => {
                    setFieldValue('appointmentDate', dayjs(date).format('YYYY-MM-DD'));
                  }}
                  // format="dd/MM/yyyy"
                  // value={values.appointmentDate ? new Date(values.appointmentDate) : null} // Check for empty string
                  // onChange={(date) => {
                  //   if (date) {
                  //     setFieldValue('appointmentDate', dayjs(date).format('YYYY-MM-DD'));
                  //   } else {
                  //     setFieldValue('appointmentDate', null); // Reset to empty string if date is cleared
                  //   }
                  // }}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={3.8}>
            <Stack my={1}>
              <ListItem>
                {/* <ListItemIcon sx={{ color: 'primary.main', mr: 2, display: { xs: 'none', sm: 'block' } }}>
                  <Clock variant="Broken" />
                </ListItemIcon> */}
                <ListItemText
                  id="switch-list-label-oc"
                  primary={<Typography variant="h6">Permanent Employee ?</Typography>}
                  //secondary="Is this project is on going project"
                />
                <Switch
                  edge="end"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>, checked) => {
                    setFieldValue('isPermanentEmp', checked);
                    //setShowPermanentEmpField(!showPermanentEmpField);
                    setShowPermanentEmpField(checked);
                  }}
                  checked={values.isPermanentEmp}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-oc'
                  }}
                />
              </ListItem>
            </Stack>
          </Grid>

          {/* -----------------PERMANANT EMP FIELD------------------- */}
          {showPermanentEmpField && (
            <>
              <Grid item xs={3.8}>
                <FormControl fullWidth>
                  <InputLabel sx={{ mb: 1 }}>Nps</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    displayEmpty
                    id="demo-simple-select"
                    value={values.isNps}
                    placeholder="nps"
                    name="isNps"
                    onChange={handleChange}
                  >
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* ------PAY LEVEL----- */}
              <Grid item xs={12} sm={3.8}>
                <InputLabel htmlFor="payLevelId">User Type</InputLabel>
                <Autocomplete
                  // value={fyear}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '48px'
                      // minWidth: '100px',
                      // maxWidth: 'auto'
                    },
                    '& .MuiOutlinedInput-root': {
                      padding: 0
                    },
                    '& .MuiAutocomplete-inputRoot': {
                      padding: '0 14px'
                    }
                  }}
                  onChange={(_e, project) => {
                    setFieldValue('userTypeId', project?.value);
                    // setFyear({ label: project?.label, value: project?.value });
                  }}
                  multiple={false}
                  defaultValue={employeesUserTypes.find((p) => p.value === values.userTypeId)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  id="userTypeId"
                  options={employeesUserTypes}
                  renderInput={(params) => (
                    <TextField
                      error={touched.userTypeId && Boolean(errors.userTypeId)}
                      helperText={touched.userTypeId && errors.userTypeId}
                      name="userTypeId"
                      placeholder="User Type"
                      {...params}
                    />
                  )}
                />
              </Grid>
              {/* ----------- */}
              {inputlayouts2
                .filter((_) => _?.step === 1 && _.enabled === true)
                .map((field: FieldLayout) => {
                  return (
                    <Grid item xs={12} sm={3.8}>
                      <InputLabel sx={{ mb: 1 }}>{field.label}</InputLabel>
                      <TextField
                        type={field.type}
                        id={field.field}
                        {...getFieldProps(field.field)}
                        placeholder={`Enter ${field.label}`}
                        error={touched[field.field as keyof InitialFormValues] && Boolean(errors[field.field as keyof InitialFormValues])}
                        helperText={touched[field.field as keyof InitialFormValues] && errors[field.field as keyof InitialFormValues]}
                        fullWidth
                      />
                    </Grid>
                  );
                })}
              <Grid item xs={3.8}>
                <FormControl fullWidth>
                  <InputLabel sx={{ mb: 1 }}>Executive</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    displayEmpty
                    id="demo-simple-select"
                    value={values.isExecutive}
                    placeholder="Executive"
                    name="isExecutive"
                    onChange={handleChange}
                  >
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3.8}>
                {' '}
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step2;
