// material-ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// third-part
import { useFormikContext } from 'formik';

// project-import

import { useGetProjectList } from 'api/voucher';
import { initialValues } from './utils';
import { FilterInitialValues } from 'pages/vouchers/view-advance/utils';
import { useMemo } from 'react';

export default function ViewAdvanceFilterForm() {
  const { touched, values, errors, handleChange, setFieldValue, resetForm } = useFormikContext<FilterInitialValues>();
  var { projects } = useGetProjectList();
  const handleReset = () => {
    resetForm();
    // setFieldValue('projectCode', null);
  };

  const selectedProject = useMemo(() => projects.find((p) => p.value === values.projectCode), [projects, values.projectCode]);

  return (
    <>
      <Grid container gap={1} sx={{ mb: '30px' }}>
        <Grid item xs={12} sm={2.5}>
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              displayEmpty
              id="demo-simple-select"
              value={values.status}
              placeholder="status"
              name="status"
              size="small"
              onChange={handleChange}
            >
              <MenuItem value={0}>ALL</MenuItem>
              <MenuItem value={1}>OPEN</MenuItem>
              <MenuItem value={2}>CONFIRMED</MenuItem>
              <MenuItem value={5}>CANCELLED</MenuItem>
              <MenuItem value={4}>BANK INTEREST</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2.5}>
          <Autocomplete
            size="small"
            onChange={(_e, project) => {
              setFieldValue('projectCode', project?.value);
            }}
            multiple={false}
            value={selectedProject || null}
            style={{ width: '100%' }}
            id="projectCode"
            options={projects}
            renderInput={(params) => (
              <TextField
                error={touched.projectCode && Boolean(errors.projectCode)}
                helperText={touched.projectCode && errors.projectCode}
                name="projectCode"
                placeholder="Project Code"
                {...params}
              />
            )}
          />
        </Grid>

        {/* ------------------ */}
        <Grid item xs={12} sm={2.5}>
          {[
            {
              id: 2,
              label: 'Voucher Number',
              field: 'voucherNo',
              type: 'text'
            }
          ].map((field: any) => {
            return (
              <Grid item xs={12} md={12}>
                <TextField
                  type={field.type}
                  id={field.field}
                  name={field.field}
                  size="small"
                  placeholder={`Enter ${field.label}`}
                  value={values[field.field as keyof typeof initialValues]}
                  onChange={handleChange}
                  //onBlur={handleBlur}
                  error={touched[field.field as keyof typeof initialValues] && Boolean(errors[field.field as keyof typeof initialValues])}
                  helperText={
                    touched[field.field as keyof typeof initialValues] && (errors[field.field as keyof typeof initialValues] as any)
                  }
                  fullWidth
                />
              </Grid>
            );
          })}
        </Grid>
        {/* -------------- */}
        <Grid item xs={12} sm={1}>
          <Button size="small" onClick={() => handleReset()} variant="text" color="error" fullWidth sx={{ width: 'max-content', px: 4 }}>
            {'Clear'}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
