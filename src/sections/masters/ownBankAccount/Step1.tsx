import { FormHelperText, InputLabel, MenuItem, Select, Autocomplete } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { FieldLayout, InitialFormValues, inputlayouts1 } from './utils';
import { useGetBankAccountHeadType } from 'api/masters';


interface Step1Props { }
// eslint-disable-next-line no-empty-pattern
function Step1({ }: Step1Props) {
  // const { getFieldProps, touched, errors, values, setFieldValue, handleChange } = useFormikContext<InitialFormValues>();
  const { getFieldProps, touched, errors, values, setFieldValue } = useFormikContext<InitialFormValues>();
  const { accounttype, accounttypeloading, accounttypeerror } = useGetBankAccountHeadType();
  if (accounttypeloading) {
    return <div>Loading...</div>;
  }

  if (accounttypeerror) {
    return <div>Error loading donor list</div>;
  }

  const accountheadtypeOptions = Array.isArray(accounttype) ? accounttype : [];

  return (
    <Grid container spacing={3}>
      {inputlayouts1
        .filter((_) => _?.step === 1 && _.enabled === true)
        .map((field: FieldLayout) => {
          if (field.type === 'select' && field.field === 'account_type_id') {
            return (
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ mb: 1 }}>Account Head Type</InputLabel>
                <Autocomplete
                  value={accountheadtypeOptions.find(accountheadtype => accountheadtype.id === values.account_type_id) || null}
                  onChange={(_e, accountheadtype) => {
                    setFieldValue('account_type_id', accountheadtype?.id ?? ''); // Set the accountheadtype type id in Formik values
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  options={accountheadtypeOptions}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="account_type_id"
                      placeholder="Select Donor Type"
                      error={touched.account_type_id && Boolean(errors.account_type_id)} // Validation error display
                      helperText={touched.account_type_id && errors.account_type_id}
                    />
                  )}
                />
              </Grid>
            );
          }
          return (
            <Grid item xs={12} sm={6} key={field.field}>
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
