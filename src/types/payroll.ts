export interface GeneratePayBillResponseNew {
  pay_category: any;
  data: {
    id: number;
    business: number;
    count: number;
    date: string;
    description: string;
    pay_category: Paycategory[];
  };
}
export interface GeneratePayBillResponse {
  id: number;
  business: number;
  count: number;
  date: string;
  description: string;
  pay_category: Paycategory[];
}
export interface Paycategory {
  first_name: string;
  last_name: string;
  id: number;
  emp_id: string;
  pan_number: string;
  aadhar_number: string;
  gpf_number: string;
  pran_number: string;
  payslip_details: Payslipdetail[];
  is_generated: boolean;
}
export interface Payslipdetail {
  pay_category_id: number;
  pay_category_name: string;
  amount: string;
  pay_category_ordinal: string;
}
