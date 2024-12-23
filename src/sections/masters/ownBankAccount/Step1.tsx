import { InputLabel } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { FieldLayout, InitialFormValues, inputlayouts1 } from './utils';

interface Step1Props {}
// eslint-disable-next-line no-empty-pattern
function Step1({}: Step1Props) {
  // const { getFieldProps, touched, errors, values, setFieldValue, handleChange } = useFormikContext<InitialFormValues>();
  const { getFieldProps, touched, errors } = useFormikContext<InitialFormValues>();
  return (
    <Grid container spacing={3}>
      {inputlayouts1
        .filter((_) => _?.step === 1 && _.enabled === true)
        .map((field: FieldLayout) => {
          return (
            <Grid item xs={12} sm={6}>
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
  );
}

export default Step1;
