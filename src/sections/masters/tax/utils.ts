import * as Yup from 'yup';
export interface FieldLayout {
  field: string;
  enabled: boolean;
  type: 'number' | 'text';
  label: string;
  step: number;
  placeholder: string;
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
  { field: 'name', step: 1, type: 'text', enabled: true, label: 'Name', placeholder: 'TDS 0%' },
  { field: 'percentage', step: 1, type: 'number', enabled: true, label: 'Percentage', placeholder: 'Enter Percentage' }
];

export const basicFieldSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  percentage: Yup.number().required('Percentage is required'),
  type: Yup.string().required('Type is required').min(1, 'Empty string is not allowed')
});

export interface InitialFormValues {
  id?: number;
  name?: string;
  percentage?: number;
  type?: string;
}
export const initialValues: InitialFormValues = {
  name: '',
  type: 'TDS',
  percentage: 0
};

export const getvalidationSchema = (step: number) => {
  switch (step) {
    case 0:
      return basicFieldSchema;
    default:
      return Yup.object({});
  }
};
export const formateTaxPayload = async (values: InitialFormValues) => {
  return {
    name: values.name,
    type: values.type,
    percent: values.percentage
  };
};
