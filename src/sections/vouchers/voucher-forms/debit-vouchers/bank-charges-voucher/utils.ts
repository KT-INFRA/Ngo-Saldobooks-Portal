import { mimeTypes } from 'data/mimes';
import dayjs from 'dayjs';
import * as Yup from 'yup';

export interface InitialValues {
  accountHeadId: number;
  amount: number;
  paymentType: number;
  paymentRef: string;
  voucherDate: string;
  projectId: number;
  letterReferenceNo: string;
  narration: string;
  projectFiles?: File[];
  bank_id?: string;
  purpose: string;
  paymenttypeid: number;
  paymentref: string;
}

export const initialValues: InitialValues = {
  accountHeadId: 0,
  amount: 0,
  paymentRef: '',
  paymentType: 0,
  voucherDate: dayjs().format('YYYY-MM-DD'),
  projectId: 0,
  letterReferenceNo: '',
  narration: '',
  projectFiles: [],
  bank_id: '',
  purpose: '',
  paymenttypeid: 0,
  paymentref: ''
};

export default initialValues;

export const firstStepValidationSchema = Yup.object({
  accountHeadId: Yup.number().required('Account Head is required').min(1, 'Please select a valid Account Head'),
  voucherDate: Yup.string().required('Voucher Date is required').default(dayjs().format('YYYY-MM-DD')),
  projectId: Yup.number().optional(),
  letterReferenceNo: Yup.string().optional(),
  narration: Yup.string().required('Narration is required'),
  amount: Yup.number().required('Amount is required').min(1, 'Amount must be greater than 0'),
  bank_id: Yup.string().optional()
});

export const secondStepValidationSchema = Yup.object({
  paymentType: Yup.number().required('Payment Type is required').min(1, 'Please select a valid Payment Type'),
  paymentRef: Yup.string().required('Payment Reference is required')
});

export const combinedValidationSchema = firstStepValidationSchema.concat(secondStepValidationSchema);

interface FileObject {
  file: string;
  extension: string;
  mime_type: string;
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

export const formateCreateBankVoucherPayload = async (values: InitialValues) => {
  const project_files: FileObject[] = await getProjectFilesBase64(values.projectFiles!);
  return {
    business_id: 1,
    user_id: 1,
    date: values.voucherDate,
    project_id: values.projectId === 0 ? null : values.projectId,
    letter_ref_no: values.letterReferenceNo,
    narration: values.narration,
    bank_id: values.bank_id,
    items: {
      amount: Number(values.amount), // ✅ Ensure this is a number
      account_head_id: values.accountHeadId,
      purpose: values.purpose,
      payment_type_id: values.paymentType,
      ref_number: values.paymentRef,
      ordinal: 1
    },
    voucher_files: project_files,
  };
};
