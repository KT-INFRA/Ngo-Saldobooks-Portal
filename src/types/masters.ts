import { Gender } from 'config';

// ==============================|| TYPES - EMPLOYEE  ||============================== //

export interface EmployeeProps {
  modal: boolean;
}

export interface EmployeeList {
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
export interface EmployeeData {
  id?: any;
  designation: string;
  designation_shortname: string;
  employee_id: number;
  first_name: string;
  is_permanent_emp: boolean;
  last_name: string;
  prefix: string;
}
export interface EmployeeDataTypes {
  user_id: string; // Assuming user IDs are stored as strings
  prefix_id: number;
  prefix?: string;
  first_name: string;
  last_name: string;
  is_permanent_emp: boolean;
  is_nps: boolean | string; // Assuming `is_nps` can be both boolean and string based on input
  is_executive: boolean | string; // Assuming `is_executive` can be both boolean and string based on input
  appointment_dt: string; // Dates are stored as strings
  bank_name: string;
  beneficiary_name: string;
  purpose: string;
  ifsc_code: string;
  account_number: string; // Assuming account numbers are stored as strings
  pan_number: string;
  phone: string; // Assuming phone numbers are stored as strings
  emp_id: string;
  aadhar_number: string;
  gpf_number: string;
  pran_number: string;
  email: string;
  division_id: number;
  designation_id: number;
  department_id: number;
  group_id: number;
  retirment_dt: string | null; // Nullable date stored as a string
  pay_level_id: number;
  address: string;
  application_id: number;
  expiration_date: string | null; // Nullable date stored as a string
  business_id: number;
  usertype_id: number;
}

export interface VendorList {
  userId: string;
  name: string;
  email: string;
  phone: string;
  pan_number: string;
  gst_number: string;
  address: string;
  bank_name: string;
  beneficiary_name: string;
  purpose: string;
  ifsc_code: string;
  account_number: string;
  id?: number;
  is_own_account?: boolean;
}
export interface ProjectGroup {
  name: string;
}
export interface BankDetails {
  bank_name?: string;
  beneficiary_name?: string;
  purpose?: string;
  ifsc_code?: string;
  account_number?: string;
}

export interface fundingAgencyPayload {
  business_id: number;
  name: string;
  address?: string | null;
  mobile_number?: string | null;
  email?: string | null;
  pan_number?: string | null;
  state?: string | null;
  country?: string | null;
  bank_details?: BankDetails;
}
export interface FundingAgencyList {
  id: number;
  name: string;
  mobile_number: string | null;
  pan_number: string | null;
  bank_name: string | null;
  beneficiary_name: string | null;
  purpose: string | null;
  ifsc_code: string | null;
  account_number: string | null;
}
export interface TaxPayload {
  name: string;
  type: string;
  percent?: string;
}
export interface TaxList {
  id?: number;
  name: string;
  type: string;
  percent: string;
}
