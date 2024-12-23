//import * as Yup from 'yup';
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
var FinancialYear = '';
if (currentMonth >= 4) {
  FinancialYear = `FY${currentYear}-${(currentYear + 1).toString().slice(2)}`;
} else {
  FinancialYear = `FY${currentYear - 1}-${currentYear.toString().slice(2)}`;
}
export var currentFinancialYear = FinancialYear;
export interface InitialValues {
  voucherNo: string;
  projectCode: number;
  status: number;
  financialYear: string;
}
export const initialValues: InitialValues = {
  voucherNo: '',
  projectCode: 0,
  status: 0,
  financialYear: ""
};
