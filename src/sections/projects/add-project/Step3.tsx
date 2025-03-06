// import React from 'react';
// import { Autocomplete, Divider, ListItem, ListItemIcon, ListItemText, Switch, Typography } from '@mui/material';
// import { Stack } from '@mui/material';
// import { Grid, TextField } from '@mui/material';
// import { useFormikContext } from 'formik';
// import { AutoCompleteComponentProps, InitialValues } from './utils';
// import { CalendarEdit } from 'iconsax-react';

// // type FormikType = ReturnType<typeof useFormik>;

// type SelectItemType = { label: string; value: number };
// interface Step3Props {
//   employees: SelectItemType[];
// }

// // eslint-disable-next-line no-empty-pattern
// function Step3({ employees }: Step3Props) {
//   const { setFieldValue, touched, errors, values } = useFormikContext<InitialValues>();

//   return (
//     <Grid container mt={2} spacing={3}>
//       <Grid item xs={12} md={12}>
//         <Divider sx={{ borderStyle: 'dashed' }} />
//         <Grid container spacing={3} my={2}>
//           <Grid item xs={12} sm={12}>
//             <Stack spacing={1}>
//               <Typography variant="subtitle1">CO-PI</Typography>
//               <Autocomplete
//                 multiple
//                 limitTags={8}
//                 id="multiple-limit-tags"
//                 defaultValue={values.coPIs}
//                 options={employees}
//                 onChange={(e: any, selectedValues) => {
//                   setFieldValue('coPIs', selectedValues);
//                 }}
//                 getOptionLabel={(option) => option.label}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     placeholder="CO-PI"
//                     error={touched.coPIs && Boolean(errors.coPIs)}
//                     helperText={touched.coPIs && (errors.coPIs as any)}
//                   />
//                 )}
//                 sx={AutoCompleteComponentProps}
//               />
//             </Stack>
//           </Grid>
//           <Grid item xs={12} sm={12}>
//             <Stack spacing={1}>
//               {/* <InputLabel htmlFor="bankName">Associates</InputLabel> */}
//               <Typography variant="subtitle1">Associates</Typography>
//               <Autocomplete
//                 multiple
//                 limitTags={8}
//                 id="multiple-limit-tags"
//                 options={employees}
//                 getOptionLabel={(option) => option.label}
//                 defaultValue={values.associates}
//                 onChange={(e: any, selectedValues) => {
//                   setFieldValue('associates', selectedValues);
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     placeholder="Associates"
//                     error={touched.associates && Boolean(errors.associates)}
//                     helperText={touched.associates && (errors.associates as any)}
//                   />
//                 )}
//                 sx={AutoCompleteComponentProps}
//               />
//             </Stack>
//           </Grid>
//         </Grid>
//         <Divider sx={{ borderStyle: 'dashed' }} />
//         <Stack my={1}>
//           <ListItem>
//             <ListItemIcon sx={{ color: 'primary.main', mr: 2, display: { xs: 'none', sm: 'block' } }}>
//               <CalendarEdit />
//             </ListItemIcon>
//             <ListItemText
//               id="switch-list-label-oc"
//               primary={<Typography variant="h5">Project Draft Mode</Typography>}
//               secondary="You can now save and edit your project"
//             />
//             <Switch
//               edge="end"
//               onChange={(e: React.ChangeEvent<HTMLInputElement>, checked) => setFieldValue('isDraft', checked)}
//               checked={values.isDraft}
//               inputProps={{
//                 'aria-labelledby': 'switch-list-label-oc'
//               }}
//             />
//           </ListItem>
//         </Stack>
//       </Grid>
//     </Grid>
//   );
// }

// export default Step3;
