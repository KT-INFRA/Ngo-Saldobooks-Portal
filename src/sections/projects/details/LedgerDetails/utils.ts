import { createContext, useContext } from 'react';
import { ProjectLedgerList } from 'types/project';

export interface IProjectLedgerContext {
  ledgers: ProjectLedgerList[];
  isLoading: boolean;
  handleChangePage: (newPage: number) => void;
  handleChangePageSize: (size: number) => void;
  meta: {
    hasNext: boolean;
    currentPage: number;
    itemPerPage: number;
    total: number;
    totalPages: number;
  };
}

export const ProjectLedgerContext = createContext<IProjectLedgerContext | null>(null);
export const ProjectLedgerContextProvider = ProjectLedgerContext.Provider;

/**
 * Hook to get the project details from the context.
 *
 * @returns {IProjectLedgerContext | null} The project details context.
 */
export const useGetProjectLedgerContext = () => {
  const context = useContext(ProjectLedgerContext);
  if (!context) {
    throw new Error('ProjectLedgerContext must be provided in an ancestor component.');
  }
  return context;
};

export const filterInitialValues = {
  financialYear: 0,
  fromDate: null,
  toDate: null
};

export interface IFilterInitialValues {
  financialYear: number;
  fromDate: null | Date;
  toDate: null | Date;
}
