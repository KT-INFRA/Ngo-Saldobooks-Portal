export interface InternalLoanDetail {
  id: number;
  project_id: number;
  project_name: string;
  project_code: string;
  from_project_id: number;
  from_project_name: string;
  business_name: string;
  business_short_name: string;
  from_project_code: string;
  project_financial_year: any;
  number: string;
  date: any;
  status_name: string;
  letter_ref_no: string;
  receiver_type_id: number;
  voucher_type_id: number;
  narration: string;
  voucher_category_id: number;
  voucher_type: string;
  funding_agencies: string;
  loan_amount: number;
  paid_amount: number;
  voucher_details: VoucherDetail[];
}

export interface InternalLoanList {
  id: number;
  project_id: number;
  project_name: string;
  project_code: string;
  from_project_id: number;
  from_project_name: string;
  from_project_code: string;
  project_financial_year: any;
  number: string;
  date: any;
  status_id: number;
  status_name: string;
  letter_ref_no: string;
  receiver_type_id: number;
  voucher_type_id: number;
  narration: string;
  voucher_category_id: number;
  voucher_type: string;
  loan_amount: number;
  paid_amount: number;
}

export interface VoucherDetail {
  id: number;
  voucher_id: number;
  account_head_id: number;
  account_head_name: string;
  amount: string;
  purpose: string;
  payment_type_id: number;
  payment_type_name: string;
  ref_number: any;
  ordinal: number;
  bank_name: string;
  stack_holder_type_id: number;
  project_id: number;
  vendor_id: any;
  employee_id: any;
  fund_agency_id: any;
  received_from: string;
  date: any;
  voucher_type_id: number;
  voucher_type: string;
  narration: string;
  number: string;
}

export interface ViewAdvanceList {
  id: number;
  project_id: number;
  project_name: string;
  project_code: string;
  number: string;
  date?: string;
  letter_ref_no: string;
  receiver_type_id: number;
  voucher_type_id: number;
  narration: string;
  voucher_category_id: number;
  amount: number;
  status_id: number;
  status_name: string;
  payment_to: string[];
  settle_status: boolean;
  display_status: string;
}

export interface AdvanceDetailList {
  id: number;
  beneficiary_id: number;
  beneficiary_name: string;
  received_from: string;
  amount: string;
  purpose: string;
  payment_type_id: number;
  payment_type_name: string;
  voucher_id: number;
  ref_number: string;
  ordinal: number;
  account_head_id: number;
  account_head_name: string;
  bank_name: string;
  settled_details: ViewAdvanceSettledList[];
  employee_settle_status: boolean;
}

export interface ViewAdvanceSettledList {
  id: number;
  account_head_id: number;
  account_head_name: string;
  ordinal: number;
  bill_amount: number;
  purpose: string;
  voucher_id: number;
  advance_voucher_id: number;
  voucher_employee_id: number;
  voucher_employee: string;
  narration: string;
  settle_status: boolean;
}

export interface ViewAdvanceDetail {
  id: number;
  business_name: string;
  business_short_name: string;
  ledger_folio_number: any;
  project_id: number;
  project_name: string;
  project_code: string;
  project_financial_year: string;
  number: string;
  date: string;
  letter_ref_no: string;
  receiver_type_id: number;
  voucher_type_id: number;
  narration: string;
  voucher_category_id: number;
  funding_agencies: string;
  status_id: number;
  display_status: string;
  advance_slip: any;
  journal_slip: string[];
  advance_details: AdvanceDetailList[];
}
