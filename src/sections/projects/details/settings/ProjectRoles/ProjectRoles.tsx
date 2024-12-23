import { Box, Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { TextField } from '@mui/material';
import LoadingButton from 'components/@extended/LoadingButton';
import { useAddProjectRole, useGetAccessTypes, useGetProjectRoles } from 'api/project';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { useGetProjectDetailsContext } from 'pages/projects/utils';
import { Autocomplete } from '@mui/material';
import { useGetEmployeeList } from 'api/voucher';
import { AutoCompleteComponentProps } from 'sections/projects/add-project/utils';
import ProjectRolesList from './ProjectRolesList';
import { ProjectRoleProvider, ProjectRoleType } from './util';

function ProjectRoles() {
  const { project } = useGetProjectDetailsContext();
  const { addProjectRole, isLoading: isAddingProjectRole } = useAddProjectRole(project?.id!);
  const { projectRoles = [], isLoading: isLoadingProjectRoles, refetch: getProjectRoles } = useGetProjectRoles(project?.id!);
  const { employees } = useGetEmployeeList(true);
  const { accessTypes } = useGetAccessTypes();
  const [employeeId, setEmployeeId] = useState(0);
  const [accessTypeId, setAccessTypeId] = useState(0);
  const [selectedRole, setSelectedRole] = useState<ProjectRoleType | null>();

  const selectedEmployee = useMemo(() => employees.find((employee) => +employee.value === employeeId), [employees, employeeId]);
  const selectedAccessType = useMemo(
    () => accessTypes.find((accessType) => +accessType.value === accessTypeId),
    [accessTypes, accessTypeId]
  );

  const handleSetSelectedRole = (role: ProjectRoleType | null) => {
    setSelectedRole(role);
  };

  const handleAddProjectRole = async () => {
    if (employeeId) {
      const payload = {
        access_type_id: accessTypeId,
        employee_id: employeeId
      };
      await addProjectRole(payload, {
        onSuccess(response) {
          getProjectRoles();
          openSnackbar({
            open: true,
            message: response?.data?.message,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'success'
            }
          } as SnackbarProps);
        },
        onError(error) {
          var errorMessage = error.message;
          if (Array.isArray(error)) {
            errorMessage = error[0].msg;
          } else {
            errorMessage = 'An error occurred while updating the project.';
          }
          openSnackbar({
            open: true,
            message: errorMessage,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            variant: 'alert',
            alert: {
              color: 'error'
            }
          } as SnackbarProps);
        }
      });
    }
  };

  return (
    <ProjectRoleProvider
      value={{
        getProjectRoles,
        projectRoles,
        project: project!,
        isProjectRolesLoading: isLoadingProjectRoles,
        selectedRole,
        handleSetSelectedRole
      }}
    >
      <Grid item xs={12} md={12}>
        <MainCard title="Update Project Members">
          <Grid container xs={12} spacing={3}>
            <Grid item xs={12} md={5}>
              <Stack direction="row" spacing={2.5}>
                <Autocomplete
                  fullWidth
                  defaultValue={selectedEmployee || null}
                  getOptionLabel={(option) => option.label || ''}
                  onChange={(e, selectedValue) => setEmployeeId(selectedValue?.value || null)} // Update selected PI
                  options={employees}
                  renderInput={(params) => <TextField {...params} name="projectRoles" placeholder="Select Employee" />}
                  sx={AutoCompleteComponentProps}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack direction="row" spacing={2.5}>
                <Autocomplete
                  fullWidth
                  defaultValue={selectedAccessType || null}
                  getOptionLabel={(option) => option.label || ''}
                  onChange={(e, selectedValue) => setAccessTypeId(selectedValue?.value || null)} // Update selected PI
                  options={accessTypes}
                  renderInput={(params) => <TextField {...params} name="accessType" placeholder="Select Access" />}
                  sx={AutoCompleteComponentProps}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box>
                <LoadingButton
                  loading={isAddingProjectRole}
                  size="large"
                  color="primary"
                  variant="contained"
                  onClick={handleAddProjectRole}
                  disabled={!employeeId || !accessTypeId}
                  // shape="square"
                >
                  {accessTypeId === 1 ? 'Assign' : 'Add'}
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12} mt={2}>
            <ProjectRolesList />
          </Grid>
        </MainCard>
      </Grid>
    </ProjectRoleProvider>
  );
}

export default ProjectRoles;
