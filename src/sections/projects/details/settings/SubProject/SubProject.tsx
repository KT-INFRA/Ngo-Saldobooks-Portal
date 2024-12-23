import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import React, { useState } from 'react';
import { Stack } from '@mui/material';
import { TextField } from '@mui/material';
import LoadingButton from 'components/@extended/LoadingButton';
import { useGetSubProjectList, useUpdateSubProject } from 'api/project';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { useGetProjectDetailsContext } from 'pages/projects/utils';
import { Autocomplete } from '@mui/material';
import { useGetProjectList } from 'api/voucher';
import { AutoCompleteComponentProps } from 'sections/projects/add-project/utils';
import { TickCircle } from 'iconsax-react';
import SubProjectList from './SubProjectList';

function SubProject() {
  const { projects, loading } = useGetProjectList();
  const { project } = useGetProjectDetailsContext();
  const { updateSubProject, isLoading: isUpdatingProject } = useUpdateSubProject();
  const [selectedProject, setSelectedProject] = useState<{ label: string; value: number } | null>(null);
  const { subProjects, refetch: getAllSubProjects } = useGetSubProjectList(project!.id);
  const updateSubProjectList = async () => {
    if (selectedProject && selectedProject.value) {
      const payload = {
        master_project_id: project!.id,
        sub_project_id: selectedProject?.value
      };
      await updateSubProject(payload, {
        onSuccess(response) {
          if (response?.data?.result) {
            // Success response
            openSnackbar({
              open: true,
              message: response?.data?.message,
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'alert',
              alert: {
                color: 'success'
              }
            } as SnackbarProps);
            setSelectedProject(null);
            getAllSubProjects();
          } else if (Array.isArray(response?.data) && response?.data?.length > 0) {
            // Handling validation errors
            const errorMessages = response?.data?.map((err) => err.msg).join(', ');
            openSnackbar({
              open: true,
              message: errorMessages,
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              variant: 'alert',
              alert: {
                color: 'error'
              }
            } as SnackbarProps);
          }
        },
        onError(error: any) {
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
    <Grid item xs={12} md={12}>
      <MainCard title="Add Sub Project">
        <Grid container>
          <Grid item xs={12}>
            <Stack direction={'row'} spacing={2.5} justifyContent={'center'}>
              <Autocomplete
                limitTags={8}
                id="multiple-limit-tags"
                defaultValue={projects.find((project: any) => project.values === selectedProject)}
                fullWidth
                options={projects as any}
                onChange={(e: any, selectedValues) => {
                  setSelectedProject(selectedValues as any);
                }}
                title="Sub Project"
                getOptionLabel={(option) => option.label}
                renderInput={(params) => <TextField {...params} placeholder="Select Project" />}
                sx={AutoCompleteComponentProps}
              />
              <LoadingButton
                loading={isUpdatingProject}
                size="large"
                color="primary"
                variant="contained"
                onClick={updateSubProjectList}
                disabled={!selectedProject?.value}
                shape="square"
              >
                <TickCircle />
              </LoadingButton>
            </Stack>
          </Grid>
          <Grid item xs={12} mt={2}>
            <SubProjectList loading={loading} subProjects={subProjects} />
          </Grid>
        </Grid>
      </MainCard>
    </Grid>
  );
}

export default SubProject;
