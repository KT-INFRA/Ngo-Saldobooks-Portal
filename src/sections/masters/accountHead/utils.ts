// import * as Yup from 'yup';

// export interface InitialValues {
//   name: string;
// }

// export type FormValues = {
//   [key: string]: any;
// };

// export const initialValues: InitialValues = {
//   name: ''
// };

// export const validationSchema = Yup.object({
//   name: Yup.string().required('Name is required')
// });

// export const formateProjectGroupPayload = (values: InitialValues) => {
//   return {
//     business_id: 1,
//     name: values.name
//   };
// };

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
  { field: 'name', step: 1, type: 'text', enabled: true, label: 'Account Head Name', placeholder: 'Enter Account Head Name:' }
];

export const basicFieldSchema = Yup.object({
  name: Yup.string().required('Account Head Name is required'),
  account_head_type: Yup.string().required('Account Head Type is required'),
  account_head_category: Yup.string().required('Account Head category is required')
});

export interface InitialFormValues {
  id?: number;
  name: string;
  account_head_type: string;
  account_head_category: string;
}
export const initialValues: InitialFormValues = {
  name: '',
  account_head_type: '',
  account_head_category: ''
};

export const getvalidationSchema = (step: number) => {
  switch (step) {
    case 0:
      return basicFieldSchema;
    default:
      return Yup.object({});
  }
};
export const formateNewAccountHeadPayload = async (values: InitialFormValues) => {
  return {
    business_id: 1,
    name: values.name,
    account_head_type: values.account_head_type,
    account_head_category: values.account_head_category
  };
};
export const accountHeadTypeOption = [
  {
    label: 'Credit',
    value: 'C'
  },
  {
    label: 'Debit',
    value: 'D'
  },
  {
    label: 'Both',
    value: 'B'
  },
  {
    label: 'Bank Interest',
    value: 'I'
  }
];
export const accountHeadCategoryOption = [
  {
    label: 'Recurring',
    value: 'R'
  },
  {
    label: 'Non-Recurring',
    value: 'N'
  }
];
