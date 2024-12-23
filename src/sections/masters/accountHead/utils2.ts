import * as Yup from 'yup';
//import dayjs from 'dayjs';
// export interface FieldLayout {
//   field: string;
//   enabled: boolean;
//   type: 'number' | 'text';
//   label: string;
//   step: number;
//   placeholder: string;
//   //multiline?: boolean;
//   // rows?: any;
// }

// export interface IEmployeeList {
//   prefixId: number;
//   firstName: string;
//   lastName: string;
//   pan_number?: string;
//   isPermanentEmp: boolean;
//   isExecutive: boolean;
//   phone: string;
//   appointmentDate: string;
//   bank_name: string;
//   beneficiary_name: string;
//   purpose: string;
//   ifsc_code: string;
//   account_number: string;
// }
// export const inputlayouts1: FieldLayout[] = [
//   { field: 'name', step: 1, type: 'text', enabled: true, label: 'Account Head Name', placeholder: 'Enter Account Head Name:' }
// ];

export const basicFieldSchema = Yup.object({
  account_head_id: Yup.number()
    .required('Account Head is required')
    .test('is-not-zero', 'Account Head is required', (value) => value !== 0)
});

export interface InitialFormValues {
  id?: number;
  account_head_id: number;
}
export const initialValues: InitialFormValues = {
  account_head_id: 0
};

export const getvalidationSchema = (step: number) => {
  switch (step) {
    case 0:
      return basicFieldSchema;
    default:
      return Yup.object({});
  }
};
export const formateAccountHeadPayload = async (values: InitialFormValues) => {
  return {
    business_id: 1,
    account_head_id: values.account_head_id
  };
};