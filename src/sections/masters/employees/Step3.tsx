import { InputLabel } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { FieldLayout, InitialFormValues, inputlayouts1 } from './utils';
import Autocomplete from '@mui/material/Autocomplete';
import { useGetGroup, useGetEmpPayLevel } from 'api/masters';

interface Step1Props {}
// eslint-disable-next-line no-empty-pattern
function Step3({}: Step1Props) {
  const { getFieldProps, touched, errors, values, setFieldValue } = useFormikContext<InitialFormValues>();
  const { groupData = [] } = useGetGroup();
  const { empPayLevelData = [] } = useGetEmpPayLevel();
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
          {/* ----------- */}
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
            .filter((_) => _?.step === 3 && _.enabled === true)
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
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step3;
