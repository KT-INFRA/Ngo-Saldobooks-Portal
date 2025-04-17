import * as Yup from 'yup';
//import dayjs from 'dayjs';
import { UserProfile } from 'types/auth';
import storage from 'utils/storage';
const { business_id, user_id }: UserProfile = storage.getItem('user');
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
  { field: 'email', step: 1, type: 'text', enabled: true, label: 'Email', placeholder: 'Enter Email' },
  { field: 'phone', step: 1, type: 'text', enabled: true, label: 'Phone', placeholder: 'Enter phone number' },
  { field: 'pan_number', step: 1, type: 'text', enabled: true, label: 'PAN No', placeholder: 'Enter PAN No' },
  { field: 'gst_number', step: 1, type: 'text', enabled: true, label: 'GST No', placeholder: 'Enter GST No' },
  { field: 'address', step: 1, type: 'text', enabled: true, label: 'Address', placeholder: 'Enter Address' },
  { field: 'bank_name', step: 2, type: 'text', enabled: true, label: 'Bank Name', placeholder: 'Enter bank name' },
  { field: 'purpose', step: 2, type: 'text', enabled: true, label: 'Remark', placeholder: 'Enter Remark' },
  { field: 'beneficiary_name', step: 2, type: 'text', enabled: true, label: 'Beneficiary Name', placeholder: 'Enter beneficiary name' },
  { field: 'ifsc_code', step: 2, type: 'text', enabled: true, label: 'IFSC Code', placeholder: 'Enter IFSC code' },
  { field: 'account_number', step: 2, type: 'text', enabled: true, label: 'Account No', placeholder: 'Enter account no' }
];

export const basicFieldSchema = Yup.object({
  name: Yup.string().required('First Name is required'),
  // email: Yup.string().required('Email is required').email('Invalid email address'),
  email: Yup.string().optional(),
  // phone: Yup.string()
  //   .required('Mobile No is required')
  //   .matches(/^\d{10}$/, 'Phone number is not valid'),
  phone: Yup.string().optional()
    .matches(/^\d{10}$/, 'Phone number is not valid'),
  pan_number: Yup.string().optional(),
  gst_number: Yup.string().optional(),
  // address: Yup.string().required('Address is required'),
  address: Yup.string().optional(),

});

export const bankFieldSchema = Yup.object().shape({
  bank_name: Yup.string().optional(),
  beneficiary_name: Yup.string().optional(),
  ifsc_code: Yup.string().optional()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code format'),
  account_number: Yup.string().optional(),
  purpose: Yup.string().optional()
});
export interface InitialFormValues {
  id?: number;
  //userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  pan_number?: string;
  gst_number?: string;
  address?: string;
  bank_name: string;
  beneficiary_name: string;
  purpose: string;
  ifsc_code: string;
  account_number: string;
  account_type_id?: number;
}
export const initialValues: InitialFormValues = {
  //userId: '1',
  name: '',
  email: '',
  phone: '',
  pan_number: '',
  gst_number: '',
  address: '',
  bank_name: '',
  beneficiary_name: '',
  purpose: '',
  ifsc_code: '',
  account_number: '',
  account_type_id: 1
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
// export const formateVendorPayload = async (values: InitialFormValues) => {
//   return {
//     user_id: user_id,
//     name: values.name,
//     bank_name: values.bank_name,
//     beneficiary_name: values.beneficiary_name,
//     purpose: values.purpose,
//     ifsc_code: values.ifsc_code,
//     account_number: values.account_number,
//     pan_number: values.pan_number || null,
//     // phone: values.phone || null,
//     phone: values.phone,
//     email: values.email,
//     gst_number: values.gst_number || null,
//     // address: values.address || null,
//     address: values.address,
//     business_id: business_id,
//     account_type_id: 1
//   };
// };

export const formateVendorPayload = async (values: InitialFormValues) => {
  const {
    bank_name,
    beneficiary_name,
    purpose,
    ifsc_code,
    account_number,
    account_type_id = 1, // Default to 1 if not provided
    ...rest
  } = values;

  const hasBankDetails =
    bank_name || beneficiary_name || purpose || ifsc_code || account_number;

  const bank_details = hasBankDetails
    ? {
        bank_name,
        beneficiary_name,
        purpose,
        ifsc_code,
        account_number,
        account_type_id
      }
    : null;

  return {
    user_id,
    business_id,
    name: rest.name,
    pan_number: rest.pan_number || undefined,
    phone: rest.phone,
    email: rest.email,
    gst_number: rest.gst_number || undefined,
    address: rest.address,
    bank_details
  };
};



