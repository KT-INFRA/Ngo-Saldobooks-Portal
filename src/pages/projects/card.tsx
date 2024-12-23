import { useState, ChangeEvent, useMemo, memo } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

// project-imports
import ProjectCard from 'sections/projects/ProjectCard';
import ProjectModal from 'sections/projects/add-project/ProjectModal';

// import projects from 'data/projects.json';
import { useGetProject } from 'api/project';

// types
import { ProjectList } from 'types/project';

// assets
// import Breadcrumbs from 'components/@extended/Breadcrumbs';
// import { APP_DEFAULT_PATH } from 'config';
import EmptyProjectCard from '../../components/cards/skeleton/EmptyProjectCard';
import ProjectFilters from 'sections/projects/ProjectFilters';
import { FormikProvider, useFormik } from 'formik';
import { filterInitialValues, IFilterInitialValues } from './utils';

// ==============================|| PROJECT - CARD ||============================== //

function ProjectCardPage() {
  const formik = useFormik<IFilterInitialValues>({
    initialValues: filterInitialValues,
    onSubmit: () => {}
  });
  const { isLoading, meta, projects: filteredProjects = [], handleChangePage, refetch } = useGetProject(formik.values);
  const [projectModal, setProjectModal] = useState<boolean>(false);

  // let breadcrumbLinks = useMemo(
  //   () => [
  //     { title: 'Home', to: APP_DEFAULT_PATH },
  //     { title: 'Projects', to: '/projects' }
  //   ],
  //   []
  // );

  const cardData = useMemo(
    () => (isLoading ? Array.from({ length: 6 }, (_, i) => ({ id: i + 1 })) : filteredProjects),
    [filteredProjects, isLoading]
  );

  return (
    <FormikProvider value={formik}>
      {/* <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Breadcrumbs custom heading={'Projects'} links={breadcrumbLinks} />
      </Box> */}
      <ProjectFilters handleToggleProjectModal={() => setProjectModal(!projectModal)} />
      <Grid container spacing={3}>
        {cardData.map((project: ProjectList | any) => (
          <Slide key={project?.id} direction="up" in={true} timeout={50}>
            <Grid item xs={12} sm={6} lg={4}>
              <ProjectCard isLoading={isLoading} project={project} />
            </Grid>
          </Slide>
        ))}
        {!isLoading && filteredProjects.length === 0 ? (
          <Grid item lg={12}>
            <EmptyProjectCard title={''} />
          </Grid>
        ) : null}
      </Grid>
      <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        <Pagination
          sx={{ '& .MuiPaginationItem-root': { my: 0.5 } }}
          count={meta.totalPages ?? 0}
          size="medium"
          page={meta.currentPage ?? 0}
          showFirstButton
          showLastButton
          variant="combined"
          color="primary"
          onChange={(e: ChangeEvent<unknown>, page: number) => handleChangePage(page)}
        />
      </Stack>
      <ProjectModal open={projectModal} modalToggler={setProjectModal} refetch={refetch} />
    </FormikProvider>
  );
}

export default memo(ProjectCardPage);
