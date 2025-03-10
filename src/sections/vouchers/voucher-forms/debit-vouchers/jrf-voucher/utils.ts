import { mimeTypes } from 'data/mimes';
import * as Yup from 'yup';

export interface Item {
  id: number;
  name: string;
  account_head_id: number;
  beneficiary_id: number;
  amount: number;
  licence_fees: number;
  electricity_fees: number;
  water_fees: number;
  fellowship_fees: number;

}

export interface InitialValues {
  projectId: number;
  letterReferenceNo: string;
  narration: string;
  items: Item[];
  projectFiles: File[];
}

export type FormValues = {
  // Define your form values type here
  [key: string]: any;
};

export const initialValues: InitialValues = {
  projectId: 0,
  letterReferenceNo: '',
  narration: '',
  items: [
    {
      id: 1,
      name: '',
      account_head_id: 0,
      beneficiary_id: 0,
      amount: 0,
      licence_fees: 0,
      electricity_fees: 0,
      water_fees: 0,
      fellowship_fees: 0
    }
  ],
  projectFiles: []
};

export const firstStepValidationSchema = Yup.object({
  // projectId: Yup.number().required('Project ID is required').min(1, 'Please select a valid Project ID'),
  // letterReferenceNo: Yup.string().required('Letter Reference Number is required'),
  letterReferenceNo: Yup.string().optional(),
  narration: Yup.string().required('Narration is required'),
  projectId: Yup.number().optional()
});

export const secondStepValidationSchema = Yup.object({
  items: Yup.array()
    .of(
      Yup.object().shape({
        // name: Yup.string().required('Item Name is required'),
        name: Yup.string().optional(),
        // beneficiary_id: Yup.number().required('Employee is required').min(1, 'Please select a valid Employee'),
        beneficiary_id: Yup.number().optional(),
        // amount: Yup.number().required('Tax Amount is required').min(1, 'Tax Amount must be greater than 0'),
        amount: Yup.number().optional()
      })
    )
    // .min(1, 'At least one item is required')
});

export const combinedValidationSchema = firstStepValidationSchema.concat(secondStepValidationSchema);

const deduction = {
  fellowship_fees: {
    id: 4,
    name: 'Fellowship without Stipend',
    key: 'fellowship_fees'
  },
  licence_fees: {
    id: 1,
    name: 'Licence Fees',
    key: 'licence_fees'
  },
  water_fees: {
    id: 2,
    name: 'Water Charge',
    key: 'water_fees'
  },
  electricity_fees: {
    id: 3,
    name: 'Electricity',
    key: 'electricity_fees'
  }
};


interface FileObject {
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
export const formateCreateVoucherPayload = async (values: InitialValues) => {
  const project_files: FileObject[] = await getProjectFilesBase64(values.projectFiles);

  return {
    business_id: 1,
    user_id: 1,
    // project_id: values.projectId,
    project_id: values.projectId === 0 ? null : values.projectId,
    letter_ref_no: values.letterReferenceNo,
    narration: values.narration,
    receiver_type_id: 1, // for Employee
    items: values.items.map((item, index) => {
      return {
        ordinal: index + 1,
        amount: item.amount,
        beneficiary_id: item.beneficiary_id,
        purpose: item.name,
        deductions: Object.entries(deduction).map(([key, value]) => {
          return {
            jrf_deduction_id: value.id,
            amount: item[key as keyof Item]
          };
        })
      };
    }),
    voucher_files: project_files
  };
};
