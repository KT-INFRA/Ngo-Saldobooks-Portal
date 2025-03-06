import * as Yup from 'yup';
import dayjs from 'dayjs';
import { UserProfile } from 'types/auth';
import storage from 'utils/storage';
const { business_id, user_id }: UserProfile = storage.getItem('user');
export interface InitialFormValues {
  prefixId: number;
  firstName: string;
  lastName: string;
  isPermanentEmp: boolean;
  isNps: boolean;
  isExecutive: boolean;
  appointmentDate: string;
  //---bank details----
  bankName: string;
  beneficiaryName: string;
  purpose: string;
  ifscCode: string;
  accountNumber: string;
  // Optional fields
  panNumber?: string;
  phone?: string;
  //userId?: string;
  empId?: string;
  aadharNo?: string;
  gprNo?: string;
  pranNo?: string;
  email?: string;
  divisionId?: number;
  designationId?: number;
  departmentId?: number;
  groupId?: number;
  retirementDate?: string | null;
  expirationDate?: string | null;
  payLevelId?: number;
  address?: string;
  userTypeId?: number;
  applicationId?: number;
}

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
  panNumber?: string;
  isPermanentEmp: boolean;
  isExecutive: boolean;
  phone: string;
  appointmentDate: string;
  bankName: string;
  beneficiaryName: string;
  purpose: string;
  ifscCode: string;
  accountNumber: string;
}
export const inputlayouts1: FieldLayout[] = [
  { field: 'firstName', step: 1, type: 'text', enabled: true, label: 'First Name', placeholder: 'Enter first name' },
  { field: 'lastName', step: 1, type: 'text', enabled: true, label: 'Last Name', placeholder: 'Enter last name' },
  { field: 'phone', step: 1, type: 'text', enabled: true, label: 'Phone', placeholder: 'Enter phone number' },
  { field: 'email', step: 1, type: 'text', enabled: true, label: 'Email', placeholder: 'Enter Email' },
  { field: 'empId', step: 2, type: 'text', enabled: true, label: 'Employee Id', placeholder: 'Enter Employee Id' },
  { field: 'panNumber', step: 3, type: 'text', enabled: true, label: 'PAN Number', placeholder: 'Enter PAN number' },
  { field: 'aadharNo', step: 3, type: 'text', enabled: true, label: 'Aadhar No', placeholder: 'Enter Aadhar No' },
  { field: 'gprNo', step: 3, type: 'text', enabled: true, label: 'GPF No', placeholder: 'Enter GPF No' },
  { field: 'pranNo', step: 3, type: 'text', enabled: true, label: 'pran No', placeholder: 'Enter pran No' },
  { field: 'bankName', step: 4, type: 'text', enabled: true, label: 'Bank Name', placeholder: 'Enter bank name' },
  { field: 'beneficiaryName', step: 4, type: 'text', enabled: true, label: 'Beneficiary Name', placeholder: 'Enter beneficiary name' },
  { field: 'purpose', step: 4, type: 'text', enabled: true, label: 'Remark', placeholder: 'Enter Remark' },
  { field: 'ifscCode', step: 4, type: 'text', enabled: true, label: 'IFSC Code', placeholder: 'Enter IFSC code' },
  { field: 'accountNumber', step: 4, type: 'text', enabled: true, label: 'Account Number', placeholder: 'Enter account number' }
];
export const inputlayouts2: FieldLayout[] = [
  { field: 'address', step: 1, type: 'text', enabled: true, label: 'Address', placeholder: 'Enter Address' }
];

export const personalFieldSchema = Yup.object({
  prefixId: Yup.number().required('Prefix ID is required').notOneOf([0], 'Prefix ID is required'),
  firstName: Yup.string().required('First Name is required'),
  // lastName: Yup.string().required('Last Name is required'),
  lastName: Yup.string().optional(),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number is not valid')
    .required('Mobile No is required'),
  // email: Yup.string().email('Invalid email address').required('First Name is required')
  email: Yup.string().optional()
});
export const officeFieldSchema = Yup.object({
  empId: Yup.string().when('isPermanentEmp', {
    is: (value: boolean) => value === true,
    then: (schema) => schema.required('Address is required'),
    otherwise: (schema) => schema.optional()
  }),
  divisionId: Yup.number().when('isPermanentEmp', {
    is: (value: boolean) => value === true,
    then: (schema) => schema.required('Division is required').notOneOf([0], 'Division is required'),
    otherwise: (schema) => schema.optional()
  }),
  designationId: Yup.number().when('isPermanentEmp', {
    is: (value: boolean) => value === true,
    then: (schema) => schema.required('Designation is required').notOneOf([0], 'Designation is required'),
    otherwise: (schema) => schema.optional()
  }),
  departmentId: Yup.number().when('isPermanentEmp', {
    is: (value: boolean) => value === true,
    then: (schema) => schema.required('Department is required').notOneOf([0], 'Department is required'),
    otherwise: (schema) => schema.optional()
  }),
  appointmentDate: Yup.string()
    .required('Appointment Date is required')
    .when('isPermanentEmp', {
      is: (value: boolean) => value === true,
      then: (schema) => schema.required('Address is required'),
      otherwise: (schema) => schema.optional()
    }),
  isPermanentEmp: Yup.boolean().required('Permanent Employee is required'),
  address: Yup.string().when('isPermanentEmp', {
    is: (value: boolean) => value === true,
    then: (schema) => schema.required('Address is required'),
    otherwise: (schema) => schema.optional()
  }),
  userTypeId: Yup.number().when('isPermanentEmp', {
    is: (value: boolean) => value === true,
    then: (schema) => schema.required('Usertype is required').notOneOf([0], 'Usertype is required'),
    otherwise: (schema) => schema.optional()
  }),
  isExecutive: Yup.boolean().when('isPermanentEmp', {
    is: (value: boolean) => value === true,
    then: (schema) => schema.required('Address is required'),
    otherwise: (schema) => schema.optional()
  })
});

export const payrollFieldSchema = Yup.object({
  groupId: Yup.number()
    .optional()
    .when('isPermanentEmp', {
      is: (value: boolean) => value === true,
      then: (schema) => schema.required('Group is required').notOneOf([0], 'Group is required'),
      otherwise: (schema) => schema.optional()
    }),
  payLevelId: Yup.number()
    .optional()
    .when('isPermanentEmp', {
      is: (value: boolean) => value === true,
      then: (schema) => schema.required('Paylevel is required').notOneOf([0], 'Paylevel is required'),
      otherwise: (schema) => schema.optional()
    }),
  panNumber: Yup.string()
    .optional()
    .when('isPermanentEmp', {
      is: (value: boolean) => value === true,
      then: (schema) => schema.required('PAN No is required'),
      otherwise: (schema) => schema.optional()
    }),
  aadharNo: Yup.string()
    .optional()
    .when('isPermanentEmp', {
      is: (value: boolean) => value === true,
      then: (schema) => schema.required('Aadhar No is required'),
      otherwise: (schema) => schema.optional()
    }),
  gprNo: Yup.string()
    .optional()
    .when('isPermanentEmp', {
      is: (value: boolean) => value === true,
      then: (schema) => schema.required('GPF No is required'),
      otherwise: (schema) => schema.optional()
    }),
  pranNo: Yup.string()
    .optional()
    .when('isPermanentEmp', {
      is: (value: boolean) => value === true,
      then: (schema) => schema.required('Pran No is required'),
      otherwise: (schema) => schema.optional()
    })
});

export const bankFieldSchema = Yup.object().shape({
  bankName: Yup.string().required('Bank Name is required'),
  beneficiaryName: Yup.string().required('Beneficiary Name is required'),
  ifscCode: Yup.string()
    .required('IFSC Code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code format'),
  accountNumber: Yup.string().required('Account Number is required').matches(/^\d+$/, 'Account Number must be numeric'),
  // purpose: Yup.string().required('Purpose is required')
  purpose: Yup.string().optional()
});

export const initialValues: InitialFormValues = {
  prefixId: 0,
  firstName: '',
  lastName: '',
  isPermanentEmp: false,
  isNps: false,
  isExecutive: false,
  appointmentDate: dayjs().format('YYYY-MM-DD'),
  //appointmentDate: '',
  //---bank details----
  bankName: '',
  beneficiaryName: '',
  purpose: '',
  ifscCode: '',
  accountNumber: '',
  // Optional fields
  panNumber: '',
  phone: '',
  //userId: '5',
  empId: '',
  aadharNo: '',
  gprNo: '',
  pranNo: '',
  email: '',
  divisionId: 0,
  designationId: 0,
  departmentId: 0,
  groupId: 0,
  retirementDate: null,
  expirationDate: null,
  payLevelId: 0,
  address: '',
  userTypeId: 0
};

export const getvalidationSchema = (step: number) => {
  switch (step) {
    case 0:
      return personalFieldSchema;
    case 1:
      return officeFieldSchema;
    case 2:
      return payrollFieldSchema;
    case 3:
      return bankFieldSchema;
    default:
      return Yup.object({});
  }
};
export const formateEmployeePayload = async (values: InitialFormValues) => {
  return {
    //user_id: values.userId,
    user_id: user_id,
    prefix_id: values.prefixId,
    first_name: values.firstName,
    last_name: values.lastName,
    is_permanent_emp: values.isPermanentEmp,
    is_nps: values.isNps,
    is_executive: values.isExecutive,
    appointment_dt: values.appointmentDate,
    bank_name: values.bankName,
    beneficiary_name: values.beneficiaryName,
    purpose: values.purpose,
    ifsc_code: values.ifscCode,
    account_number: values.accountNumber,
    pan_number: values.panNumber || null,
    phone: values.phone,
    //emp_id: values.empId === '' ? null : values.empId,
    emp_id: values.empId || null,
    aadhar_number: values.aadharNo,
    gpf_number: values.gprNo || null,
    pran_number: values.pranNo || null,
    email: values.email,
    division_id: values.divisionId || null,
    designation_id: values.designationId || null,
    department_id: values.departmentId || null,
    group_id: values.groupId || null,
    retirment_dt: values.retirementDate,
    pay_level_id: values.payLevelId || null,
    address: values.address || null,
    application_id: 1,
    expiration_date: values.expirationDate,
    business_id: business_id,
    usertype_id: values.userTypeId
  };
};
