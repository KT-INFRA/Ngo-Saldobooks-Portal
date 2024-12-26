import { mimeTypes } from 'data/mimes';
import * as Yup from 'yup';

export interface Item {
  id: number;
  account_head_id: number;
  project_id: number;
  amount: number;
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
      account_head_id: 0,
      project_id: 0,
      amount: 0
    }
  ],
  projectFiles: []
};

export const firstStepValidationSchema = Yup.object({
  projectId: Yup.number().required('Project ID is required').min(1, 'Please select a valid Project ID'),
  // letterReferenceNo: Yup.string().required('Letter Reference Number is required'),
  letterReferenceNo: Yup.string().optional(),
  narration: Yup.string().required('Narration is required')
});

export const secondStepValidationSchema = Yup.object({
  items: Yup.array()
    .of(
      Yup.object().shape({
        account_head_id: Yup.number().required('Account Head ID is required').min(1, 'Please select a valid Account Head ID'),
        project_id: Yup.number().required('Project is required').min(1, 'Please select a valid Project'),
        amount: Yup.number().required('Tax Amount is required').min(1, 'Tax Amount must be greater than 0')
      })
    )
    .min(1, 'At least one item is required')
});

export const combinedValidationSchema = firstStepValidationSchema.concat(secondStepValidationSchema);


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
    project_id: values.projectId,
    letter_ref_no: values.letterReferenceNo,
    narration: values.narration,
    amount: 0,
    debit_items: values.items.map((item, index) => {
      return {
        ordinal: index + 1,
        amount: item.amount,
        account_head_id: item.account_head_id,
        project_id: item.project_id
      };
    }),
    voucher_files: project_files
  };
};
