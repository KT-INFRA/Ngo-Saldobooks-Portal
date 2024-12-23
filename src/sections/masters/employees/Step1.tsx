import { InputLabel } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { FieldLayout, InitialFormValues, inputlayouts1 } from './utils';
import Autocomplete from '@mui/material/Autocomplete';
import { useGetPrefix } from 'api/masters';

interface Step1Props {}
// eslint-disable-next-line no-empty-pattern
function Step1({}: Step1Props) {
  const { getFieldProps, touched, errors, values, setFieldValue } = useFormikContext<InitialFormValues>();
  const { prefixData = [] } = useGetPrefix();
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
          {/* ------prefix----- */}
          <Grid item xs={12} sm={3.8}>
            <InputLabel htmlFor="payment_type_id">Prefix</InputLabel>
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
                setFieldValue('prefixId', project?.value);
                // setFyear({ label: project?.label, value: project?.value });
              }}
              multiple={false}
              defaultValue={prefixData.find((p) => p.value === values.prefixId)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              id="prefixId"
              options={prefixData}
              renderInput={(params) => (
                <TextField
                  error={touched.prefixId && Boolean(errors.prefixId)}
                  helperText={touched.prefixId && errors.prefixId}
                  name="prefixId"
                  placeholder="Prefix"
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
          <Grid item xs={3.8}></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Step1;
