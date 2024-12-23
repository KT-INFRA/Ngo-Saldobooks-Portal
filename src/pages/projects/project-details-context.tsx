import { useEffect, useState } from 'react';
import { ProjectDetailsComponent } from './project-details';
import { useLocation, useNavigate } from 'react-router';
import { ProjectDetailsContext } from './utils';
import { ProjectDetailType } from 'types/project';
import { useGetProjectDetail } from 'api/project';

export default function ProjectDetails(props: any) {
  const [breadcrumbs, setBreadcrumbs] = useState<any>([]);
  const { state } = useLocation();
  const { projectId = 0 } = state || {};
  const {
    loading,
    project,
    refetch: getProjectAgain
  }: {
    loading: boolean;
    project: ProjectDetailType;
    refetch: () => void;
  } = useGetProjectDetail(Number(projectId));

  const navigate = useNavigate();

  const addBreadcrumb = (breadcrumb: any) => {
    setBreadcrumbs((prev: any) => [...prev, breadcrumb]);
  };

  useEffect(() => {
    if (breadcrumbs.length > 0) {
      const currentIndex = breadcrumbs.findIndex((breadcrumb: any) => breadcrumb.state.projectId === projectId);
      if (currentIndex >= 0) {
        const splicedBreadcrumbs = breadcrumbs.toSpliced(currentIndex, breadcrumbs.length);
        setBreadcrumbs(splicedBreadcrumbs);
      }
    }
    return () => {};
  }, [breadcrumbs, projectId]);

  useEffect(() => {
    if (!projectId) {
      navigate('/projects');
    }
  }, [projectId, navigate]);

  return (
    <ProjectDetailsContext.Provider
      value={{ breadcrumbs, addBreadcrumb, project, handleGetProjectAgain: getProjectAgain, loading, projectId }}
    >
      <ProjectDetailsComponent {...props} />
    </ProjectDetailsContext.Provider>
  );
}
