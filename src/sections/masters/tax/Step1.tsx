import { InputLabel } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { FieldLayout, InitialFormValues, inputlayouts1 } from './utils';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect } from 'react';
interface Step1Props {
  selectedTax: string;
}
// eslint-disable-next-line no-empty-pattern
function Step1({ selectedTax }: Step1Props) {
  const { getFieldProps, touched, errors, handleChange, setFieldValue, values } = useFormikContext<InitialFormValues>();
  useEffect(() => {
    if (selectedTax) {
      setFieldValue('name', `${selectedTax} ${values.percentage || 0} %`);
      setFieldValue('type', `${selectedTax}`);
    }
  }, [selectedTax, setFieldValue, values.percentage]);
  return (
    <Grid container spacing={3}>
      {inputlayouts1
        .filter((_) => _?.step === 1 && _.enabled === true)
        .map((field: FieldLayout) => {
          return (
            <Grid item xs={12} sm={3.5}>
              <InputLabel sx={{ mb: 1 }}>{field.label}</InputLabel>
              <TextField
                type={field.type}
                id={field.field}
                {...getFieldProps(field.field)}
                placeholder={field.field === 'name' ? `${selectedTax} 0%` : `Enter ${field.label}`}
                error={touched[field.field as keyof InitialFormValues] && Boolean(errors[field.field as keyof InitialFormValues])}
                helperText={touched[field.field as keyof InitialFormValues] && errors[field.field as keyof InitialFormValues]}
                fullWidth
                InputProps={field.field === 'name' ? { readOnly: true } : {}}
              />
            </Grid>
          );
        })}
      <Grid item xs={12} sm={3.5}>
        <InputLabel sx={{ mb: 1 }}>Type</InputLabel>
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            displayEmpty
            id="demo-simple-select"
            value={values.type}
            placeholder="Type"
            name="type"
            onChange={handleChange}
            readOnly
          >
            <MenuItem value={'TDS'}>TDS</MenuItem>
            <MenuItem value={'GST'}>GST</MenuItem>
            <MenuItem value={'CESS'}>CESS</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default Step1;
