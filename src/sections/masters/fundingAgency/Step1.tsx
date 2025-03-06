import { InputLabel, TextField, Autocomplete } from '@mui/material';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useGetDonorList } from 'api/masters';
import { FieldLayout, InitialFormValues, inputlayouts1 } from './utils';

interface Step1Props { }

function Step1({ }: Step1Props) {
  // const { DonorList, DonorListLoading, DonorError } = useGetDonorList();  
  const { DonorList, DonorListLoading, DonorError } = useGetDonorList();
  console.log(DonorList);
  if (DonorListLoading) {
    return <div>Loading...</div>;
  }

  if (DonorError) {
    return <div>Error loading donor list</div>;
  }

  const donorTypeOptions = Array.isArray(DonorList) ? DonorList : [];

  const { getFieldProps, touched, errors, setFieldValue, values } = useFormikContext<InitialFormValues>();

  return (
    <Grid container mt={2} spacing={3}>
      <Grid item xs={12} md={12}>
        <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {inputlayouts1
            .filter((_) => _?.step === 1 && _.enabled === true)
            .map((field: FieldLayout) => {
              if (field.type === 'select' && field.field === 'donor_type_id') {
                return (
                  <Grid item xs={12} sm={6}>
                    <InputLabel sx={{ mb: 1 }}>Donor Type</InputLabel>
                    <Autocomplete
                      value={donorTypeOptions.find(donor => donor.id === values.donor_type_id) || null}
                      onChange={(_e, donor) => {
                        setFieldValue('donor_type_id', donor?.id ?? ''); // Set the donor type id in Formik values
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      options={donorTypeOptions}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="donor_type_id"
                          placeholder="Select Donor Type"
                          error={touched.donor_type_id && Boolean(errors.donor_type_id)} // Validation error display
                          helperText={touched.donor_type_id && errors.donor_type_id}
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
      </Grid>
    </Grid>
  );
}

export default Step1;
