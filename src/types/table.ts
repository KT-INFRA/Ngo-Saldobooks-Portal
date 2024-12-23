import { ChangeEvent, SyntheticEvent } from 'react';

// material-ui
import { TableCellProps } from '@mui/material/TableCell';

//project imports
import { Gender } from 'config';

// types
import { KeyedObject } from './root';

// ==============================|| TYPES - TABLES  ||============================== //

export type ArrangementOrder = 'asc' | 'desc' | undefined;

export type GetComparator = (o: ArrangementOrder, o1: string) => (a: KeyedObject, b: KeyedObject) => number;

export interface EnhancedTableHeadProps extends TableCellProps {
  onSelectAllClick: (e: ChangeEvent<HTMLInputElement>) => void;
  order: ArrangementOrder;
  orderBy?: string;
  numSelected: number;
  rowCount: number;
  onRequestSort: (e: SyntheticEvent, p: string) => void;
}

export interface EnhancedTableToolbarProps {
  numSelected: number;
}

export type HeadCell = {
  id: string;
  numeric: boolean;
  label: string;
  disablePadding?: string | boolean | undefined;
  align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
};

export type TableDataApiResponse = {
  data: TableDataProps[];
  meta: {
    totalRowCount: number;
  };
};

export type TableDataProps = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  fatherName: string;
  email: string;
  age: number;
  gender: Gender;
  role: string;
  visits: number;
  progress: number;
  status: string;
  orderStatus: string;
  contact: string;
  country: string;
  address: string;
  about: string;
  avatar: number;
  skills: string[];
  time: string[];
};

export interface VoucherDetailsItem {
  id: number;
  voucher_id: number;
  account_head_id: number;
  account_head_name: string;
  amount: string;
  purpose: string;
  ordinal: number;
}

export interface VoucherTableDataProps {
  id: number;
  project_id: number;
  number: string;
  date: string;
  voucher_type_id: number;
  voucher_type: string;
  status_id: number;
  status_name: string;
  Voucher_details: VoucherDetailsItem[];
}
