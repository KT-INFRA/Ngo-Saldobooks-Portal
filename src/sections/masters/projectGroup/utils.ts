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
  { field: 'name', step: 1, type: 'text', enabled: true, label: 'Name', placeholder: 'Enter name' }
];

export const basicFieldSchema = Yup.object({
  name: Yup.string().required('First Name is required')
});

export interface InitialFormValues {
  id?: number;
  name?: string;
}
export const initialValues: InitialFormValues = {
  name: ''
};

export const getvalidationSchema = (step: number) => {
  switch (step) {
    case 0:
      return basicFieldSchema;
    default:
      return Yup.object({});
  }
};
export const formateVendorPayload = async (values: InitialFormValues) => {
  return {
    business_id: 1,
    name: values.name
  };
};
