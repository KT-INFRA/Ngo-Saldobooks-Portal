import * as Yup from 'yup';
//import dayjs from 'dayjs';
import { UserProfile } from 'types/auth';
import storage from 'utils/storage';
const { business_id }: UserProfile = storage.getItem('user');
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

export interface IEmployeeList {
  prefixId: number;
  firstName: string;
  lastName: string;
  pan_number?: string;
  isPermanentEmp: boolean;
  isExecutive: boolean;
  phone: string;
  appointmentDate: string;
  bank_name: string;
  beneficiary_name: string;
  purpose: string;
  ifsc_code: string;
  account_number: string;
}
export const inputlayouts1: FieldLayout[] = [
  { field: 'name', step: 1, type: 'text', enabled: true, label: 'Name', placeholder: 'Enter name' },
  { field: 'address', step: 1, type: 'text', enabled: true, label: 'Address', placeholder: 'Enter Address' },
  { field: 'mobile_number', step: 1, type: 'text', enabled: true, label: 'Phone', placeholder: 'Enter phone number' },
  { field: 'email', step: 1, type: 'text', enabled: true, label: 'Email', placeholder: 'Enter Email' },
  { field: 'pan_number', step: 1, type: 'text', enabled: true, label: 'PAN No', placeholder: 'Enter PAN No' },
  { field: 'state', step: 1, type: 'text', enabled: true, label: 'State', placeholder: 'Enter State' },
  { field: 'country', step: 1, type: 'text', enabled: true, label: 'Country', placeholder: 'Enter Country' },
  { field: 'bank_name', step: 2, type: 'text', enabled: true, label: 'Bank Name', placeholder: 'Enter bank name' },
  { field: 'purpose', step: 2, type: 'text', enabled: true, label: 'Remark', placeholder: 'Enter Remark' },
  { field: 'beneficiary_name', step: 2, type: 'text', enabled: true, label: 'Beneficiary Name', placeholder: 'Enter beneficiary name' },
  { field: 'ifsc_code', step: 2, type: 'text', enabled: true, label: 'IFSC Code', placeholder: 'Enter IFSC code' },
  { field: 'account_number', step: 2, type: 'text', enabled: true, label: 'Account No', placeholder: 'Enter account no' }
];

export const basicFieldSchema = Yup.object({
  name: Yup.string().required('First Name is required'),
  email: Yup.string().optional(),
  mobile_number: Yup.string()
    .matches(/^\d{10}$/, 'Phone number is not valid')
    .optional(),
  pan_number: Yup.string().optional(),
  state: Yup.string().optional(),
  country: Yup.string().optional(),
  address: Yup.string().optional()
});

export const bankFieldSchema = Yup.object().shape({
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
  //userId?: string;
  name?: string;
  email?: string;
  mobile_number?: string;
  pan_number?: string;
  state?: string;
  country?: string;
  address?: string;
  bank_name: string;
  beneficiary_name: string;
  purpose: string;
  ifsc_code: string;
  account_number: string;
}
export const initialValues: InitialFormValues = {
  //userId: '1',
  name: '',
  email: '',
  mobile_number: '',
  pan_number: '',
  state: '',
  country: '',
  address: '',
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
    case 1:
      return bankFieldSchema;
    default:
      return Yup.object({});
  }
};
// export const formateFundingAgencyPayload = async (values: InitialFormValues) => {
//   return {
//     //user_id: values?.userId,
//     name: values?.name,
//     bank_name: values?.bank_name,
//     beneficiary_name: values?.beneficiary_name,
//     purpose: values?.purpose,
//     ifsc_code: values?.ifsc_code,
//     account_number: values?.account_number,
//     pan_number: values?.pan_number,
//     mobile_number: values?.mobile_number,
//     email: values?.email,
//     state: values?.state,
//     country: values?.country,
//     address: values?.address,
//     //application_id: 1,
//     business_id: 1
//   };
// };
export const formateFundingAgencyPayload = async (values: InitialFormValues) => {
  return {
    business_id: business_id,
    name: values?.name || null,
    address: values?.address || null,
    mobile_number: values?.mobile_number || null,
    email: values?.email || null,
    pan_number: values?.pan_number || null,
    state: values?.state || null,
    country: values?.country || null,
    bank_details: {
      bank_name: values?.bank_name || null,
      beneficiary_name: values?.beneficiary_name || null,
      purpose: values?.purpose || null,
      ifsc_code: values?.ifsc_code || null,
      account_number: values?.account_number || null
    }
  };
};
