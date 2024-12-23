import { BreadcrumbLinkProps } from 'components/@extended/Breadcrumbs';
import { createContext, useContext } from 'react';
import { ProjectDetailType } from 'types/project';

export interface IProjectDetailsContext {
  project: ProjectDetailType | null; // Allow for null to handle initial state
  handleGetProjectAgain: () => void; // Add projectId as a parameter
  breadcrumbs: BreadcrumbLinkProps[];
  addBreadcrumb: (breadcrumb: BreadcrumbLinkProps) => void;
  loading: boolean;
  projectId: number;
}

export const ProjectDetailsContext = createContext<IProjectDetailsContext | null>(null);

/**
 * Hook to get the project details from the context.
 *
 * @returns {IProjectDetailsContext | null} The project details context.
 */
export const useGetProjectDetailsContext = () => {
  const context = useContext(ProjectDetailsContext);
  if (!context) {
    throw new Error('ProjectDetailsContext must be provided in an ancestor component.');
  }
  return context;
};

export const AutoCompleteComponentProps = {
  '& .MuiOutlinedInput-root': {
    p: 0.5,
    minHeight: 48
    // '& .MuiAutocomplete-tag': { m: 0.5 }
    // '& fieldset': { border: '1px solid', borderColor: 'primary.lighter' }
    // '& .MuiAutocomplete-endAdornment': { display: 'none' },
    // '& .MuiAutocomplete-popupIndicator': { display: 'none' }
  },
  '& .MuiAutocomplete-tag': {
    bgcolor: 'primary.lighter',
    border: '1px solid primary.lighter',
    borderRadius: 1,
    pl: 1.5,
    pr: 1.5,
    borderColor: 'primary.light',
    '& .MuiChip-label': {
      paddingLeft: 0,
      paddingRight: 0
    },
    '& .MuiSvgIcon-root': {
      color: 'primary.main',
      ml: 1,
      mr: -0.75,
      '&:hover': {
        color: 'primary.dark'
      }
    }
  }
  // minWidth: 200
};

export const filterInitialValues = {
  projectIds: [],
  isMasterProject: false,
  isActive: 1
};

export interface IFilterInitialValues {
  projectIds: number[];
  isMasterProject: boolean;
  isActive: number;
}
