import React, { useState } from 'react';
import { InputLabel, Stack } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { FieldLayout, InitialFormValues, inputlayouts1, inputlayouts2 } from './utils';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dayjs from 'dayjs';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import {
  //useGetPrefix,
  useGetDivision,
  useGetDepartment,
  useGetDesignation,
  useGetGroup,
  useGetEmpPayLevel,
  useGetUserTypeList
} from 'api/masters';

interface Step1Props {}
// eslint-disable-next-line no-empty-pattern
function Step1({}: Step1Props) {
  const { getFieldProps, touched, errors, values, setFieldValue, handleChange } = useFormikContext<InitialFormValues>();
  // const { prefixData = [] } = useGetPrefix();
  const { divisionData = [] } = useGetDivision();
  const { departmentData = [] } = useGetDepartment();
  const { designationData = [] } = useGetDesignation();
  const { employeesUserTypes = [] } = useGetUserTypeList();
  const { groupData = [] } = useGetGroup();
  const { empPayLevelData = [] } = useGetEmpPayLevel();
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
          {/* ------DEPARTMENT----- */}
          <Grid item xs={12} sm={3.8}>
            <InputLabel htmlFor="departmentId">Department</InputLabel>
            <Autocomplete
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
          {/* ------DEPARTMENT----- */}
          <Grid item xs={12} sm={3.8}>
            <InputLabel htmlFor="departmentId">Department</InputLabel>
            <Autocomplete
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
          {/* ------DESIGNATION----- */}
          <Grid item xs={12} sm={3.8}>
            <InputLabel htmlFor="payment_type_id">Designation</InputLabel>
            <Autocomplete
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
              <InputLabel sx={{ mb: 1 }}>Appointment Date</InputLabel>
              <Stack>
                <MobileDatePicker
                  // format={'dd/MM/yyyy'}
                  // value={new Date(values.appointmentDate)}
                  // onChange={(date) => {
                  //   setFieldValue('appointmentDate', dayjs(date).format('YYYY-MM-DD'));
                  // }}
                  format="dd/MM/yyyy"
                  value={values.appointmentDate ? new Date(values.appointmentDate) : null}
                  onChange={(date) => {
                    if (date) {
                      setFieldValue('appointmentDate', dayjs(date).format('YYYY-MM-DD'));
                    } else {
                      setFieldValue('appointmentDate', null);
                    }
                  }}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={3.8}>
            <FormControl fullWidth>
              <InputLabel sx={{ mb: 1 }}>Permanent Employee</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                displayEmpty
                id="demo-simple-select"
                value={values.isPermanentEmp}
                placeholder="status"
                name="isPermanentEmp"
                // onChange={handleChange}
                onChange={(e) => {
                  setFieldValue('isPermanentEmp', e.target.value);
                  setShowPermanentEmpField(e.target.value === 'true' ? true : false);
                }}
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* ------GROUP----- */}
          <Grid item xs={12} sm={3.8}>
            <InputLabel htmlFor="groupId">Group</InputLabel>
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
                setFieldValue('groupId', project?.value);
                // setFyear({ label: project?.label, value: project?.value });
              }}
              multiple={false}
              defaultValue={groupData.find((p) => p.value === values.groupId)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              id="groupId"
              options={groupData}
              renderInput={(params) => (
                <TextField
                  error={touched.groupId && Boolean(errors.groupId)}
                  helperText={touched.groupId && errors.groupId}
                  name="groupId"
                  placeholder="Group"
                  {...params}
                />
              )}
            />
          </Grid>
          {/* ------PAY LEVEL----- */}
          <Grid item xs={12} sm={3.8}>
            <InputLabel htmlFor="payLevelId">Pay Level</InputLabel>
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
                setFieldValue('payLevelId', project?.value);
                // setFyear({ label: project?.label, value: project?.value });
              }}
              multiple={false}
              defaultValue={empPayLevelData.find((p) => p.value === values.payLevelId)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              id="payLevelId"
              options={empPayLevelData}
              renderInput={(params) => (
                <TextField
                  error={touched.payLevelId && Boolean(errors.payLevelId)}
                  helperText={touched.payLevelId && errors.payLevelId}
                  name="payLevelId"
                  placeholder="Pay Level"
                  {...params}
                />
              )}
            />
          </Grid>
          {/* ----------- */}
          {inputlayouts1
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <InputLabel sx={{ mb: 1 }}>Retirement Date</InputLabel>
              <Stack>
                <MobileDatePicker
                  format="dd/MM/yyyy"
                  value={values.retirementDate ? new Date(values.retirementDate) : null}
                  onChange={(date) => {
                    if (date) {
                      setFieldValue('retirementDate', dayjs(date).format('YYYY-MM-DD'));
                    } else {
                      setFieldValue('retirementDate', null);
                    }
                  }}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={3.8}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <InputLabel sx={{ mb: 1 }}>Expiration Date</InputLabel>
              <Stack>
                <MobileDatePicker
                  // format={'dd/MM/yyyy'}
                  // value={new Date(values.expirationDate as string)}
                  // onChange={(date) => {
                  //   setFieldValue('expirationDate', dayjs(date).format('YYYY-MM-DD'));
                  // }}
                  format="dd/MM/yyyy"
                  value={values.expirationDate ? new Date(values.expirationDate) : null}
                  onChange={(date) => {
                    if (date) {
                      setFieldValue('expirationDate', dayjs(date).format('YYYY-MM-DD'));
                    } else {
                      setFieldValue('expirationDate', null);
                    }
                  }}
                />
              </Stack>
            </LocalizationProvider>
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

export default Step1;
