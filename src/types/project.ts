// import { Gender } from 'config';

// ==============================|| TYPES - PROJECT  ||============================== //

export interface ProjectProps {
  modal: boolean;
}

export interface ProjectList {
  id: number;
  title: string;
  project_code: string;
  start_date: string;
  duration: number;
  approved_budget: string;
  consumed_amount: number;
  is_draft: boolean;
  is_active: boolean;
  pi_user: any[];
  project_group_id: number;
  project_group_name: string;
  master_project: boolean;
  // ----
  // total:number;
  // data:any[];
  // totalProjects:number;
}

export interface ProjectLedgerList {
  id: number;
  project_id: number;
  number: string;
  date: string;
  voucher_type_id: number;
  voucher_type: string;
  narration: string;
  status_id: number;
  status_name: string;
  total_amount: number;
  voucher_details: ProjectLedgerVoucherDetail[];
}

export interface ProjectLedgerVoucherDetail {
  id: number;
  voucher_id: number;
  account_head_id: number;
  account_head_name: string;
  amount: string;
  purpose: string;
  ordinal: number;
}

export interface ProjectLedgerList {
  id: number;
  title: string;
  project_code: string;
  start_date: string;
  duration: number;
  approved_budget: string;
  consumed_amount: number;
  is_draft: boolean;
  is_active: boolean;
  pi_user: any[];
  project_group_id: number;
  project_group_name: string;
  master_project: boolean;
  // ----
  // total:number;
  // data:any[];
  // totalProjects:number;
}

// export interface ProjectList {

//   firstName: string;
//   lastName: string;
//   id?: number;
//   avatar: number;
//   name: string;
//   fatherName: string;
//   email: string;
//   age: number;
//   gender: Gender;
//   role: string;
//   orders: number;
//   progress: number;
//   status: number;
//   orderStatus: string;
//   contact: string;
//   country: string;
//   location: string;
//   about: string;
//   skills: string[];
//   time: string[];
//   date: Date | string | number;
// }

export interface ProjectDetailType {
  id: number;
  title: string;
  project_code: string;
  start_date: string;
  duration: number;
  extend_duration: number;
  funding_agencies: string;
  credit_amount: number;
  debit_amount: number;
  approved_budget: string;
  is_draft: boolean;
  is_active: boolean;
  pi_user: PiUser[];
  pi_user_list: PiUser[];
  co_pi_user: PiUser[];
  co_pi_user_list: PiUser[];
  associate_user: any[];
  associate_user_list: any[];
  sub_project: any[];
  master_project: any;
  project_group_id: number;
  project_group_name: string;
  project_files: any[];
  project_extension_files: any[];
}

export interface PiUser {
  id: number;
  project: number;
  prefix: string;
  first_name: string;
  last_name: string;
  access_type_id: number;
  access_type: string;
  employee_id: number;
  effective_date: string;
  expiration_date: any;
}


export interface ProjectInternalLoan {
  id: number;
  number: string; 
  date: string;
  from_project_name: string; 
  to_project_name: string; 
  narration: string; 
  loan: number; 
  debit: number;
  status_name: string;
}
export interface TotalProjectInternalLoan {
  voucher_type: string;
  total_amount: number;
};

export interface ProjectAccountHead {
  id: number; 
  account_head: string; 
  total_amount: {
    credit: number; 
    debit: number;
    };
}
