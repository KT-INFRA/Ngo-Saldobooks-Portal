import { ColumnDef } from '@tanstack/react-table';
import { createContext, useContext } from 'react';
import { InternalLoanDetail, InternalLoanList } from 'types/vouchers';

export interface ViewInternalLoanContextProps {
  data: InternalLoanList[];
  isLoading: boolean;
  columns: ColumnDef<InternalLoanList>[];
  selectedLoan: InternalLoanList | null;
  loanDetail: InternalLoanDetail | null;
  handleChangePage: (newPage: number) => void;
  meta: {
    hasNext: any;
    currentPage: number;
    itemPerPage: number;
    total: number;
    totalPages: number;
  };
}
export const ViewInternalLoanContext = createContext<ViewInternalLoanContextProps | null>(null);
export const ViewInternalLoanProvider = ViewInternalLoanContext.Provider;
export const useViewInternalLoanContext = () => {
  return useContext(ViewInternalLoanContext);
};
