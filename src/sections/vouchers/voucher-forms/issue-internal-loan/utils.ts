import { mimeTypes } from 'data/mimes';
import * as Yup from 'yup';

export interface InitialValues {
  fromProjectId: number;
  toProjectId: number;
  loanAmount: number;
  letterReferenceNo: string;
  narration: string;
  projectFiles: File[];
}

export type FormValues = {
  // Define your form values type here
  [key: string]: any;
};

export const initialValues: InitialValues = {
  fromProjectId: 0,
  toProjectId: 0,
  loanAmount: 0,
  letterReferenceNo: '',
  narration: '',
  projectFiles: [] 
};

export const validationSchema = Yup.object({
  fromProjectId: Yup.number().required('Project ID is required').min(1, 'Please select a valid Project ID'),
  toProjectId: Yup.number().required('Project ID is required').min(1, 'Please select a valid Project ID'),
  loanAmount: Yup.number().required('Loan Amount required').min(1, 'Loan Amount must be greater than 0'),
  letterReferenceNo: Yup.string().required('Letter Reference Number is required'),
  narration: Yup.string().required('Narration is required')
});

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
    project_id: values.toProjectId,
    from_project_id: values.fromProjectId,
    letter_ref_no: values.letterReferenceNo,
    narration: values.narration,
    amount: values.loanAmount,
    voucher_files: project_files
  };
};
