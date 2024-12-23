import { createContext, useContext } from 'react';
import { ProjectDetailType } from 'types/project';

export interface ProjectRoleType {
  id: number;
  project_id: number;
  prefix: string;
  first_name: string;
  last_name: string;
  access_type_id: number;
  access_type: string;
  employee_id: number;
  effective_date: string;
  expiration_date: string;
}
export interface IProjectRoleContext {
  projectRoles: ProjectRoleType[];
  isProjectRolesLoading: boolean;
  getProjectRoles: () => void;
  project: ProjectDetailType;
  selectedRole: ProjectRoleType | null | undefined;
  handleSetSelectedRole: (data: ProjectRoleType | null) => void;
}
export const ProjectRoleContext = createContext<IProjectRoleContext | null>(null);
export const ProjectRoleProvider = ProjectRoleContext.Provider;
export const useProjectRoleContext = () => {
  return useContext(ProjectRoleContext);
};
