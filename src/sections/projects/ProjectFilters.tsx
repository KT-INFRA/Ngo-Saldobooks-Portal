import { Checkbox } from '@mui/material';
import { Stack } from '@mui/material';
import { Grid, Autocomplete, TextField, Select, MenuItem, FormControl, FormGroup, FormControlLabel, Button } from '@mui/material';
import { useGetProjectList } from 'api/project';
import { useFormikContext } from 'formik';
import { Add } from 'iconsax-react';
import { AutoCompleteComponentProps, IFilterInitialValues } from 'pages/projects/utils';
import React, { memo } from 'react';
import { useMemo } from 'react';
import { UserSubModule } from 'types/auth';
import { getUserModuleData, SubModuleButtonEnum, SubModuleEnum, UserModuleEnum } from 'utils/modules';

interface IProjectFilters {
  handleToggleProjectModal: () => void;
}

function ProjectFilters({ handleToggleProjectModal }: IProjectFilters) {
  const { values, setFieldValue, getFieldProps } = useFormikContext<IFilterInitialValues>();
  const { projects } = useGetProjectList();

  const voucherModule = useMemo(
    () => getUserModuleData(UserModuleEnum.Projects, SubModuleEnum.Projects.ViewProjects),
    []
  )! as UserSubModule;
  const getPermission = (buttonEnum: number) => voucherModule.sub_module_button.find((module) => module.sub_module_button === buttonEnum);
  const canAddProject = getPermission(SubModuleButtonEnum.Projects.ViewProjects.AddNewProject);
  const checkedItems = useMemo(
    () => projects.filter((project) => values.projectIds.includes(project.value)),
    [projects, values.projectIds]
  );
  return (
    <Grid container spacing={3} xs={12} mb={3}>
      <Grid item md={4} xs={6}>
        <Autocomplete
          multiple
          limitTags={2}
          id="checkboxes-projectCode"
          options={projects}
          onChange={(_e, project) => {
            const formatedItem = project.map((item) => item.value);
            setFieldValue('projectIds', formatedItem);
          }}
          value={checkedItems}
          sx={AutoCompleteComponentProps}
          renderInput={(params) => <TextField {...params} placeholder="Select Project" />}
        />
      </Grid>

      <Grid item md={3} xs={6}>
        <Select
          sx={{ width: '100%' }}
          {...getFieldProps('isActive')}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          placeholder="Status"
        >
          <MenuItem value={0}>Completed</MenuItem>
          <MenuItem value={1}>Active</MenuItem>
        </Select>
      </Grid>
      <Grid item md={3} xs={6}>
        <FormControl component="fieldset">
          {/* <FormLabel sx={{ mt: -2.5 }}>Main Project</FormLabel>
          <Select
            sx={{ width: '100%' }}
            {...getFieldProps('isMasterProject')}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            placeholder="Status"
          >
            <MenuItem value={0}>No</MenuItem>
            <MenuItem value={1}>Yes</MenuItem>
          </Select> */}
          <FormGroup aria-label="position" row>
            <FormControlLabel control={<Checkbox {...getFieldProps('isMasterProject')} />} labelPlacement="end" label="Main Project" />
            {/* <FormControlLabel control={<Checkbox {...getFieldProps('isMasterProject')} />} labelPlacement="end" label="Main Project" /> */}
          </FormGroup>
        </FormControl>
      </Grid>
      <Grid item md={2} xs={6} display={'flex'} justifyContent={'right'}>
        {canAddProject && (
          <Stack>
            <Button variant="contained" onClick={handleToggleProjectModal} size="large" startIcon={<Add />}>
              Add
            </Button>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}

export default memo(ProjectFilters);
