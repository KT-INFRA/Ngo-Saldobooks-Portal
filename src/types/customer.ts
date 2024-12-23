import { Gender } from 'config';

// ==============================|| TYPES - CUSTOMER  ||============================== //

export interface CustomerProps {
  modal: boolean;
}

export interface CustomerList {
  firstName: string;
  lastName: string;
  id?: number;
  avatar: number;
  name: string;
  fatherName: string;
  email: string;
  age: number;
  gender: Gender;
  role: string;
  orders: number;
  progress: number;
  status: number;
  orderStatus: string;
  contact: string;
  country: string;
  location: string;
  about: string;
  skills: string[];
  time: string[];
  date: Date | string | number;
}
export interface CreditvoucherList {
  id: number;
  project_id: number;
  project_name: string;
  project_financial_year: string | null;
  project_code: string;
  number: string;
  date: string | null;
  letter_ref_no: string | null;
  receiver_type_id: number;
  voucher_type_id: number;
  narration: string;
  voucher_category_id: number;
  funding_agencies: string;
  amount: number;
  status_id: number;
  status_name: string;
  account_head: string;
}
