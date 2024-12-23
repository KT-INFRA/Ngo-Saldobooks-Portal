// material-ui
import Grid from '@mui/material/Grid';

// third-party

// project-imports

// assets
import SubProjectCard from '../SubProjectCard';
import EmptyProjectCard from 'components/cards/skeleton/EmptyProjectCard';
import { useCallback } from 'react';
import { useGetSubProjectList } from 'api/project';
import { useGetProjectDetailsContext } from 'pages/projects/utils';

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

export default function SubProjects() {
  const { project, addBreadcrumb } = useGetProjectDetailsContext()!;
  const beforeNavigateSubProject = useCallback(() => {
    addBreadcrumb({
      title: project!.project_code,
      to: `/projects/details`,
      state: {
        projectId: project!.id,
        isSubProject: true
      }
    });
  }, [addBreadcrumb, project]);
  const { subProjects = [], loading } = useGetSubProjectList(project!.id);

  // const subProjects = useMemo(() => [...((project && project?.sub_project) || [])], [project]);

  if ([...subProjects].length === 0 && !loading) {
    return <EmptyProjectCard title={''} />;
  }

  return (
    <Grid container spacing={3} py={2} px={3}>
      {subProjects?.map((project: any) => {
        return (
          <Grid item xs={12} md={4} lg={4}>
            <div style={{ width: '100%' }}>
              <SubProjectCard onNavigate={beforeNavigateSubProject} project={project.sub_project} />
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
}
