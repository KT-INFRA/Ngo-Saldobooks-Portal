import { mimeTypes } from 'data/mimes';
import dayjs from 'dayjs';
// import { convertFileToBase64 } from 'sections/payslips/payslip-upload/utils';
import { UserProfile } from 'types/auth';
import storage from 'utils/storage';

import * as Yup from 'yup';

const { user_id, business_id }: UserProfile = storage.getItem('user');

export interface InitialValues {
  projectGroup: number;
  projectCode: string;
  projectTitle: string;
  projectPI: number;
  projectApprovedBudget: number;
  fundingAgency: number;
  projectStart: string;
  projectDuration: number;
  bankName: string;
  beneficiaryName: string;
  ifscCode: string;
  accountNumber: string;
  purpose: string;
  associates: { label: string; value: number }[];
  coPIs: { label: string; value: number }[];
  isDraft: boolean;
  isOnGoing: boolean;
  projectFiles: File[];
}

export const initialValues = {
  projectCode: '',
  projectTitle: '',
  projectPI: 0,
  projectApprovedBudget: 0,
  fundingAgency: 0,
  projectStart: dayjs().format('YYYY-MM-DD'),
  projectDuration: 0,
  bankName: '',
  beneficiaryName: '',
  ifscCode: '',
  accountNumber: '',
  purpose: '',
  associates: [],
  coPIs: [],
  isDraft: false,
  isOnGoing: false,
  project_file: []
};

export const basicFieldSchema = Yup.object().shape({
  projectCode: Yup.string().required('Project Code is required'),
  projectTitle: Yup.string().required('Project Title is required'),
  // projectPI: Yup.number().required('Project PI is required').min(1, 'Project PI is required'),
  projectPI: Yup.number().optional(),
 // fundingAgency: Yup.number().optional(),
//  projectStart: Yup.string().optional(),
  //isOnGoing: Yup.boolean().optional(),
  // projectApprovedBudget: Yup.number().required('Project Approved Budget is required').positive('Budget must be positive'),
  // projectDuration: Yup.number().required('Project Duration is required').positive('Duration must be positive')
  // projectDuration: Yup.number().when('isOnGoing', {
  //   is: true,
  //   then: (schema) => schema.notRequired(), // ✅ optional when isOnGoing is true
  //   otherwise: (schema) =>
  //     schema
  //       .required('Project Duration is required')
  //       .positive('Project duration must be a positive number'),
  // }),  
  // projectApprovedBudget: Yup.number().when('isOnGoing', {
  //   is: true,
  //   then: (schema) => schema.notRequired(),
  //   otherwise: (schema) =>
  //     schema.required('Project Approved Budget is required').positive('Project approved budget must be a positive number'),
  // }),
  
});
// export const bankFieldSchema = Yup.object().shape({
//   bankName: Yup.string().required('Bank Name is required'),
//   beneficiaryName: Yup.string().required('Beneficiary Name is required'),
//   ifscCode: Yup.string()
//     .required('IFSC Code is required')
//     .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code format'),
//   accountNumber: Yup.string().required('Account Number is required').matches(/^\d+$/, 'Account Number must be numeric'),
//   purpose: Yup.string().required('Purpose is required')
// });
export const bankFieldSchema = Yup.object().shape({
  bankName: Yup.string(), // removed .required()
  beneficiaryName: Yup.string(),
  ifscCode: Yup.string().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code format'),
  accountNumber: Yup.string().matches(/^\d+$/, 'Account Number must be numeric'),
  purpose: Yup.string()
});


export const assignFieldSchema = Yup.object().shape({
  associates: Yup.array().min(1, 'Select At least one Associate'),
  coPIs: Yup.array().min(1, 'Select At least one Co PI')
});

export const getvalidationSchema = (step: number) => {
  switch (step) {
    case 0:
      return basicFieldSchema;
    case 1:
      return bankFieldSchema;
    case 2:
      return assignFieldSchema;
    default:
      return Yup.object({});
  }
};

export const AutoCompleteComponentProps = {
  '& .MuiOutlinedInput-root': {
    p: 1,
    '& .MuiAutocomplete-tag': { m: 1 },
    '& fieldset': { border: '1px solid', borderColor: 'primary.lighter' }
    // '& .MuiAutocomplete-endAdornment': { display: 'none' },
    // '& .MuiAutocomplete-popupIndicator': { display: 'none' }
  },
  '& .MuiAutocomplete-tag': {
    bgcolor: 'primary.lighter',
    border: '1px solid primary.lighter',
    borderRadius: 1,
    height: 32,
    pl: 1.5,
    pr: 1.5,
    lineHeight: '32px',
    borderColor: 'primary.light',
    '& .MuiChip-label': {
      paddingLeft: 0,
      paddingRight: 0
    },
    '& .MuiSvgIcon-root': {
      color: 'primary.main',
      ml: 1,
      mr: -0.75,
      '&:hover': {
        color: 'primary.dark'
      }
    }
  }
};

enum AccessType {
  PI_USER = 1,
  COPI = 2,
  ASSOCIATES = 3
}

const getEmployeesBasedOnAccessType = (values: InitialValues) => {
  const piUser = {
    employee_id: values.projectPI,
    access_type_id: AccessType.PI_USER
  };

  const mapEmployees = (employees: any, accessType: AccessType) =>
    employees.map((employee: any) => ({
      employee_id: employee.value,
      access_type_id: accessType
    }));

  const piUsersData = mapEmployees(values.coPIs, AccessType.COPI);
  const associates = mapEmployees(values.associates, AccessType.ASSOCIATES);

  return [piUser, ...piUsersData, ...associates];
};

interface FileObject {
  // file: Uint8Array;
  file: string;
  extension: string; // Extension type .png, .jpg, ....
  mime_type: string; // MIME TYPE image/jpeg, application/pdf,...
  description: string;
}

type FileExtensions = keyof typeof mimeTypes;

const getMimeType = (extension: FileExtensions): string => {
  return mimeTypes[extension];
};

async function getProjectFilesBase64(files: File[]): Promise<FileObject[]> {
  const promises = Array.from(files).map(
    (file) =>
      new Promise<FileObject>(async (resolve, reject) => {
        try {
          const extension_key = file?.name?.split('.')?.pop();
          const extension = `.${extension_key}`;
          const reader = new FileReader();
          reader.readAsDataURL(file);
          await new Promise((resolve) => (reader.onload = resolve));
          const base64Data = reader.result as string;
          const fileObject: FileObject = {
            file: base64Data.split(',')[1],
            extension: extension,
            mime_type: getMimeType(extension as FileExtensions),
            description: ''
          };
          resolve(fileObject);
        } catch (error) {
          reject(error);
        }
      })
  );

  return Promise.all(promises);
}
// async function getProjectFilesBytes(files: File[]): Promise<FileObject[]> {
//   const promises = files.map((file) => {
//     return new Promise<FileObject>((resolve, reject) => {
//       try {
//         const extensionKey = file.name.split('.').pop();
//         const extension = `.${extensionKey}`;
//         const reader = new FileReader();

//         reader.onload = () => {
//           const arrayBuffer = reader.result as ArrayBuffer;
//           const byteArray = new Uint8Array(arrayBuffer);

//           const fileObject: FileObject = {
//             file: byteArray,
//             extension: extension,
//             mime_type: getMimeType(extension as FileExtensions),
//             description: ''
//           };
//           resolve(fileObject);
//         };

//         reader.onerror = (error) => {
//           reject(error);
//         };

//         reader.readAsArrayBuffer(file);
//       } catch (error) {
//         reject(error);
//       }
//     });
//   });

//   return Promise.all(promises);
// }

// export const formateCreateProjectPayload = async (values: InitialValues) => {
//   const project_files: FileObject[] = await getProjectFilesBase64(values.projectFiles);
//   return {
//     business_id: business_id,
//     project_group_id: values.projectGroup,
//     user_id: user_id,
//     title: values.projectTitle,
//     project_code: values.projectCode,
//     start_date: values.projectStart,
//     duration: values.projectDuration,
//     funding_agencies_id: values.fundingAgency,
//     approved_budget: values.projectApprovedBudget,
//     is_draft: values.isDraft,
//     project_file: project_files,
//     bank_details: {
//       bank_name: values.bankName,
//       beneficiary_name: values.beneficiaryName,
//       purpose: values.purpose,
//       ifsc_code: values.ifscCode,
//       account_number: values.accountNumber
//     },
//     project_role_list: getEmployeesBasedOnAccessType(values)
//   };
// };
export const formateCreateProjectPayload = async (values: InitialValues) => {
  const project_files: FileObject[] = await getProjectFilesBase64(values.projectFiles);

  const payload: any = {
    business_id: business_id,
    user_id: user_id,
    title: values.projectTitle,
    project_code: values.projectCode,
    start_date: values.projectStart,
    duration: values.projectDuration,
    funding_agencies_id: values.fundingAgency,
    approved_budget: values.projectApprovedBudget,
    is_draft: values.isDraft,
    project_group_id: 1,
    project_file: project_files,
    bank_details: {
      bank_name: values.bankName,
      beneficiary_name: values.beneficiaryName,
      purpose: values.purpose,
      ifsc_code: values.ifscCode,
      account_number: values.accountNumber
    }
  };

  // Add conditionally if value is provided
  if (values.projectGroup) {
    payload.project_group_id = values.projectGroup;
  }

  const roleList = getEmployeesBasedOnAccessType(values);
  if (roleList && roleList.length > 0) {
    payload.project_role_list = roleList;
  }

  return payload;
};
