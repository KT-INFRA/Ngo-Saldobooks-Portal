import * as Yup from 'yup';
import { UserProfile } from 'types/auth';
import storage from 'utils/storage';

const { business_id }: UserProfile = storage.getItem('user');

// FieldLayout Interface
export interface FieldLayout {
  field: string;
  enabled: boolean;
  type: 'number' | 'text' | 'select';
  label: string;
  step: number;
  placeholder: string;
}

// InitialFormValues Interface: Add `donor_type_id` field here
export interface InitialFormValues {
  // id?: number;
  // bank_name: string;
  // beneficiary_name: string;
  // purpose: string;
  // ifsc_code: string;
  // account_number: string;
  donor_type_id: string;  // Added donor_type_id field
  name?: string;
  address?: string;
  mobile_number?: string;
  email?: string;
  pan_number?: string;
  state?: string;
  country?: string;
  

}

// Input Layout for Fields
export const inputlayouts1: FieldLayout[] = [
  { field: 'name', step: 1, type: 'text', enabled: true, label: 'Name', placeholder: 'Enter name' },
  { field: 'address', step: 1, type: 'text', enabled: true, label: 'Address', placeholder: 'Enter Address' },
  { field: 'mobile_number', step: 1, type: 'text', enabled: true, label: 'Phone', placeholder: 'Enter phone number' },
  { field: 'email', step: 1, type: 'text', enabled: true, label: 'Email', placeholder: 'Enter Email' },
  { field: 'pan_number', step: 1, type: 'text', enabled: true, label: 'PAN No', placeholder: 'Enter PAN No' },
  { field: 'state', step: 1, type: 'text', enabled: true, label: 'State', placeholder: 'Enter State' },
  { field: 'country', step: 1, type: 'text', enabled: true, label: 'Country', placeholder: 'Enter Country' },
  { field: 'donor_type_id', step: 1, type: 'select', enabled: true, label: 'Donor Type', placeholder: 'Select Donor Type' },  // Added donor type field
  // { field: 'bank_name', step: 2, type: 'text', enabled: true, label: 'Bank Name', placeholder: 'Enter bank name' },
  // { field: 'purpose', step: 2, type: 'text', enabled: true, label: 'Remark', placeholder: 'Enter Remark' },
  // { field: 'beneficiary_name', step: 2, type: 'text', enabled: true, label: 'Beneficiary Name', placeholder: 'Enter beneficiary name' },
  // { field: 'ifsc_code', step: 2, type: 'text', enabled: true, label: 'IFSC Code', placeholder: 'Enter IFSC code' },
  // { field: 'account_number', step: 2, type: 'text', enabled: true, label: 'Account No', placeholder: 'Enter account no' },
];

// Basic Validation Schema for Initial Form
export const basicFieldSchema = Yup.object({
  name: Yup.string().required('First Name is required'),
  email: Yup.string().optional(),
  mobile_number: Yup.string()
    .matches(/^\d{10}$/, 'Phone number is not valid')
    .optional(),
  pan_number: Yup.string().optional(),
  state: Yup.string().optional(),
  country: Yup.string().optional(),
  address: Yup.string().optional(),
  donor_type_id: Yup.string().required('Donor Type is required'),  // Added validation for donor_type_id
});

// Bank Validation Schema for Additional Fields
// export const bankFieldSchema = Yup.object().shape({
//   bank_name: Yup.string().optional(),
//   beneficiary_name: Yup.string().required('Beneficiary Name is required'),
//   ifsc_code: Yup.string()
//     .optional()
//     .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code format'),
//   account_number: Yup.string().required('Account Number is required').matches(/^\d+$/, 'Account Number must be numeric'),
//   purpose: Yup.string().required('Purpose is required'),
//   fund_type: Yup.string().oneOf(['CSR FUND', 'NON CSR FUND'], 'Fund must be CSR FUND or Non-CSR FUND').required('Fund Type is required'),
// });

// Initial Form Values with the new donor_type_id field
export const initialValues: InitialFormValues = {
  name: '',
  email: '',
  mobile_number: '',
  pan_number: '',
  state: '',
  country: '',
  address: '',
  // bank_name: '',
  // beneficiary_name: '',
  // purpose: '',
  // ifsc_code: '',
  // account_number: '',
  donor_type_id: '', // Added initial value for donor_type_id
};

// Function to return validation schema based on the form step
export const getvalidationSchema = (step: number) => {
  switch (step) {
    case 0:
      return basicFieldSchema;
    // case 1:
    //   return bankFieldSchema;
    // default:
    //   return Yup.object({});
  }
};

// Formatting Function for Payload
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
    // bank_details: {
    //   bank_name: values?.bank_name || null,
    //   beneficiary_name: values?.beneficiary_name || null,
    //   purpose: values?.purpose || null,
    //   ifsc_code: values?.ifsc_code || null,
    //   account_number: values?.account_number || null
    // },
    donor_type_id: values?.donor_type_id || null,  // Add donor_type_id to the payload
  };
};
