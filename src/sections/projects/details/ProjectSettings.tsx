import { lazy, Suspense, useMemo } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import { getUserModuleData, SubModuleButtonEnum, SubModuleEnum, UserModuleEnum } from 'utils/modules';
import { UserSubModule } from 'types/auth';

// Lazy-loaded components
const ProjectRoles = lazy(() => import('./settings/ProjectRoles/ProjectRoles'));
const ProjectExtension = lazy(() => import('./settings/ProjectExtension'));
const BudgetSplits = lazy(() => import('./settings/BudgetSplits/BudgetSplits'));
const ProjectStatusUpdate = lazy(() => import('./settings/ProjectStatusUpdate/ProjectStatusUpdate'));
const SubProject = lazy(() => import('./settings/SubProject/SubProject'));
const ProjectDocuments = lazy(() => import('./settings/ProjectDocuments/ProjectDocuments'))

export default function ProjectSettings() {
  const projectModule = getUserModuleData(UserModuleEnum.Projects, SubModuleEnum.Projects.ViewProjects)! as UserSubModule;

  const permissions = useMemo(() => {
    const getPermission = (buttonEnum: number) => projectModule.sub_module_button.find((button) => button.sub_module_button === buttonEnum);
    return {
      canChangeProjectPI: getPermission(SubModuleButtonEnum.Projects.ViewProjects.ChangePI)?.access,
      canUpdateSubProject: getPermission(SubModuleButtonEnum.Projects.ViewProjects.UpdateProjectHierarchy)?.access,
      canProjectExtension: getPermission(SubModuleButtonEnum.Projects.ViewProjects.ExtendProjectDuration)?.access,
      canUpdateProjectBudgetSplit: getPermission(SubModuleButtonEnum.Projects.ViewProjects.UpdateProjectBudgetSplit)?.access,
      canMarkProjectCompleted: getPermission(SubModuleButtonEnum.Projects.ViewProjects.MarkProjectAsCompleted)?.access
    };
  }, [projectModule.sub_module_button]);

  return (
    <Grid container spacing={3}>
      <Suspense fallback={<div>Loading...</div>}>
        {permissions.canChangeProjectPI && <ProjectRoles />}
        {permissions.canUpdateSubProject && <SubProject />}
        {permissions.canProjectExtension && <ProjectExtension />}
        {permissions.canUpdateProjectBudgetSplit && <BudgetSplits />}
        {true && <ProjectDocuments />}
        {permissions.canMarkProjectCompleted && <ProjectStatusUpdate />}
      </Suspense>
    </Grid>
  );
}
