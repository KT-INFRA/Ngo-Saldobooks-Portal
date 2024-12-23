import { InputLabel } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { FieldLayout, InitialFormValues, inputlayouts1, accountHeadCategoryOption, accountHeadTypeOption } from './utils';
import Autocomplete from '@mui/material/Autocomplete';
interface Step1Props {}
// eslint-disable-next-line no-empty-pattern
function Step1({}: Step1Props) {
  // const { getFieldProps, touched, errors, values, setFieldValue, handleChange } = useFormikContext<InitialFormValues>();
  const { getFieldProps, touched, errors, setFieldValue, values } = useFormikContext<InitialFormValues>();
  return (
    <Grid container spacing={3}>
      {inputlayouts1
        .filter((_) => _?.step === 1 && _.enabled === true)
        .map((field: FieldLayout) => {
          return (
            <Grid item xs={12} sm={3.8}>
              <InputLabel>{field.label}</InputLabel>
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
      <Grid item xs={12} sm={3.8}>
        <InputLabel htmlFor="account_head_type">Account Head Type </InputLabel>
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
            setFieldValue('account_head_type', project?.value);
            // setFyear({ label: project?.label, value: project?.value });
          }}
          multiple={false}
          defaultValue={accountHeadTypeOption.find((p) => p.value === values.account_head_type)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          id="account_head_type"
          options={accountHeadTypeOption}
          renderInput={(params) => (
            <TextField
              error={touched.account_head_type && Boolean(errors.account_head_type)}
              helperText={touched.account_head_type && errors.account_head_type}
              name="account_head_type"
              placeholder="Account Head Type"
              {...params}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3.8}>
        <InputLabel htmlFor="account_head_type">Account Head Category </InputLabel>
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
            setFieldValue('account_head_category', project?.value);
            // setFyear({ label: project?.label, value: project?.value });
          }}
          multiple={false}
          defaultValue={accountHeadCategoryOption.find((p) => p.value === values.account_head_category)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          id="account_head_category"
          options={accountHeadCategoryOption}
          renderInput={(params) => (
            <TextField
              error={touched.account_head_category && Boolean(errors.account_head_category)}
              helperText={touched.account_head_category && errors.account_head_category}
              name="account_head_category"
              placeholder="Account Head Category"
              {...params}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default Step1;
