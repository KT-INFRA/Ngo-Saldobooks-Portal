import { ColumnDef } from '@tanstack/react-table';
import { createContext, useContext } from 'react';
import { ViewAdvanceDetail, ViewAdvanceList } from 'types/vouchers';

export interface ViewAdvanceContextProps {
  data: ViewAdvanceList[];
  isLoading: boolean;
  columns: ColumnDef<ViewAdvanceList>[];
  selectedAdvance: ViewAdvanceList | null;
  advanceDetail: ViewAdvanceDetail | null;
  handleChangePage: (newPage: number) => void;
  handleGetAdvanceList: () => void;
  meta: {
    hasNext: any;
    currentPage: number;
    itemPerPage: number;
    total: number;
    totalPages: number;
  };
}
export const ViewAdvanceContext = createContext<ViewAdvanceContextProps | null>(null);
export const ViewAdvanceProvider = ViewAdvanceContext.Provider;
export const useViewAdvanceContext = () => {
  return useContext(ViewAdvanceContext);
};
