import { useState, SyntheticEvent, useMemo, useEffect, lazy, Suspense } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// project-imports
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';

// assets
import { ArrangeHorizontal, ArrangeVerticalSquare, Bezier, Bill, BoxSearch, DocumentFilter, Setting2, TableDocument } from 'iconsax-react';
import { Skeleton, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import { useGetProjectDetailsContext } from './utils';

const ProjectDetails = lazy(() => import('sections/projects/details/ProjectDetails'));
const LedgerDetails = lazy(() => import('sections/projects/details/LedgerDetails/LedgerDetails'));
const SubProjects = lazy(() => import('sections/projects/details/SubProjects'));
const ProjectSettings = lazy(() => import('sections/projects/details/ProjectSettings'));
const AccountHead = lazy(() => import('sections/projects/details/AccountHead/AccountHead'));
const ProjectInternalLoan = lazy(() => import('sections/projects/details/ProjectInternalLoan/ProjectInternalLoan')); 

export function ProjectDetailsComponent() { 
  const [value, setValue] = useState(0);
  const { breadcrumbs, addBreadcrumb, projectId, project, loading } = useGetProjectDetailsContext()!;

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  type layoutType = {
    [key: string]: {
      Component: any;
      breadcrumbHeading: string;
      breadcrumbTitle: string;
    };
  };

  const layout: layoutType = useMemo(
    () => ({
      0: {
        Component: ProjectDetails,
        breadcrumbHeading: 'Profile',
        breadcrumbTitle: 'Profile'
      },
      1: {
        Component: SubProjects,
        breadcrumbHeading: 'Sub Projects',
        breadcrumbTitle: 'Sub Projects'
      },
      2: {
        Component: LedgerDetails,
        breadcrumbHeading: 'Ledger',
        breadcrumbTitle: 'Ledger'
      },
      3: {
        Component: ProjectInternalLoan,
        breadcrumbHeading: 'Update',
        breadcrumbTitle: 'Update'
      },
      4: {
        Component: AccountHead,
        breadcrumbHeading: 'Account Head',
        breadcrumbTitle: 'Account Head'
      },
      5: {
        Component: ProjectSettings,
        breadcrumbHeading: 'Update',
        breadcrumbTitle: 'Update'
      }
    }),
    []
  );

  let breadcrumbLinks = useMemo(
    () => [
      { title: 'Home', to: APP_DEFAULT_PATH },
      { title: 'Projects', to: '/projects' },
      ...breadcrumbs,
      { title: project?.project_code },
      { title: layout[value].breadcrumbTitle }
    ],
    [breadcrumbs, layout, project?.project_code, value]
  );
  const Component = layout[value].Component;

  useEffect(() => {
    if (projectId) {
      setValue(0);
    }
  }, [projectId]);
  return (
    <>
      <Breadcrumbs custom links={breadcrumbLinks as any} />
      <Stack maxWidth={'90%'} gap={2} mb={2}>
        <Stack maxWidth={'90%'} gap={loading ? 0 : 2} mb={loading ? 0 : 2}>
          <>
            {loading ? (
              <>
                <Skeleton height={30} animation="wave" />
                <Skeleton height={30} width={150} animation="wave" />
              </>
            ) : (
              <Typography variant="h4">{project?.title}</Typography>
            )}
          </>
          <>
            {loading ? (
              <Skeleton width={100} animation="wave" />
            ) : (
              <Typography variant="body2" color={'secondary'}>
                {project?.project_code}
              </Typography>
            )}
          </>
        </Stack>
      </Stack>
      <MainCard border={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
            <Tab label="Details" icon={<BoxSearch />} iconPosition="start" />
            <Tab label="Sub Project" icon={<Bezier />} iconPosition="start" />
            <Tab label="Ledger" icon={<TableDocument />} iconPosition="start" />
            <Tab label="Internal Loan" icon={<ArrangeVerticalSquare />} iconPosition="start" />
            <Tab label="Expense by AccountHead" icon={<Bill />} iconPosition="start" />
            <Tab label="Project Update" icon={<Setting2 />} iconPosition="start" />
          </Tabs>
        </Box>
        {/* {isSubProject && 'hi'} */}
        <Box sx={{ mt: 2.5 }}>
          <Suspense>
            <Component breadcrumbs={breadcrumbs} addBreadcrumb={addBreadcrumb} isLoading={loading} project={project} />
          </Suspense>
        </Box>
      </MainCard>
    </>
  );
}
