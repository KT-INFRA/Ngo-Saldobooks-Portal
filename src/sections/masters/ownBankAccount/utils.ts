import * as Yup from 'yup';
//import dayjs from 'dayjs';
export interface FieldLayout {
  field: string;
  enabled: boolean;
  type: 'number' | 'text';
  label: string;
  step: number;
  placeholder: string;
  //multiline?: boolean;
  // rows?: any;
}

export const inputlayouts1: FieldLayout[] = [
  { field: 'bank_name', step: 1, type: 'text', enabled: true, label: 'Bank Name', placeholder: 'Enter bank name' },
  { field: 'purpose', step: 1, type: 'text', enabled: true, label: 'Remark', placeholder: 'Enter Remark' },
  { field: 'beneficiary_name', step: 1, type: 'text', enabled: true, label: 'Beneficiary Name', placeholder: 'Enter beneficiary name' },
  { field: 'ifsc_code', step: 1, type: 'text', enabled: true, label: 'IFSC Code', placeholder: 'Enter IFSC code' },
  { field: 'account_number', step: 1, type: 'text', enabled: true, label: 'Account No', placeholder: 'Enter account no' }
];

export const basicFieldSchema = Yup.object({
  bank_name: Yup.string().required('Bank Name is required'),
  beneficiary_name: Yup.string().required('Beneficiary Name is required'),
  ifsc_code: Yup.string()
    .required('IFSC Code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code format'),
  account_number: Yup.string().required('Account Number is required').matches(/^\d+$/, 'Account Number must be numeric'),
  purpose: Yup.string().required('Purpose is required')
});

export interface InitialFormValues {
  id?: number;
  bank_name: string;
  beneficiary_name: string;
  purpose: string;
  ifsc_code: string;
  account_number: string;
  is_active?: boolean;
}
export const initialValues: InitialFormValues = {
  bank_name: '',
  beneficiary_name: '',
  purpose: '',
  ifsc_code: '',
  account_number: ''
};

export const getvalidationSchema = (step: number) => {
  switch (step) {
    case 0:
      return basicFieldSchema;
    default:
      return Yup.object({});
  }
};
export const formateOwnBankAccountPayload = async (values: InitialFormValues) => {
  return {
    business_id: 1,
    bank_name: values?.bank_name || null,
    beneficiary_name: values?.beneficiary_name || null,
    purpose: values?.purpose || null,
    ifsc_code: values?.ifsc_code || null,
    account_number: values?.account_number || null
  };
};
