import { mimeTypes } from 'data/mimes';
import dayjs from 'dayjs';
import * as Yup from 'yup';

interface Item {
  id: number;
  name: string;
  account_head_id: number;
  amount: number;
}

export interface InitialValues {
  voucherNo: string;
  paymentType: number;
  paymentRef: string;
  voucherDate: string;
  projectId: number;
  letterReferenceNo: string;
  narration: string;
  projectFiles: File[];
  items: Item[];
  donor_type_id: number;
  bank_id: string;
}

export type FormValues = {
  // Define your form values type here
  [key: string]: any;
};

export const initialValues: InitialValues = {
  voucherNo: '',
  donor_type_id: 0,
  paymentType: 0,
  paymentRef: '',
  voucherDate: dayjs().format('YYYY-MM-DD'),
  projectId: 0,
  letterReferenceNo: '',
  narration: '',
  projectFiles: [],  
  bank_id: '',
  items: [
    {
      id: 1,
      name: '',
      account_head_id: 0,
      amount: 0
    }
  ]
};

export default initialValues;

export const firstStepValidationSchema = Yup.object({
  voucherNo: Yup.number().required('Voucher Number is required').min(1, 'Voucher Number Should be Greater than 0'),
  
  paymentType: Yup.number().required('Payment Type is required').min(1, 'Please select a valid Payment Type'),
  paymentRef: Yup.string().required('Payment Reference is required'),
  voucherDate: Yup.string().required('Voucher Date is required').default(dayjs().format('YYYY-MM-DD')),
  projectId: Yup.number().required('Project ID is required').min(1, 'Please select a valid Project ID'),
  // letterReferenceNo: Yup.string().required('Letter Reference Number is required'),
  letterReferenceNo: Yup.string().optional(),
  narration: Yup.string().required('Narration is required'),
  bank_id: Yup.string().optional(),
});

export const secondStepValidationSchema = Yup.object({
  items: Yup.array()
    .of(
      Yup.object().shape({
        // name: Yup.string().required('Item Name is required'),
        name: Yup.string().optional(),
        // account_head_id: Yup.number().required('Account Head ID is required').min(1, 'Please select a valid Account Head ID'),
        account_head_id: Yup.string().optional(),
        amount: Yup.number().required('Amount is required').min(1, 'Amount must be greater than 0')
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
    number: values.voucherNo + '/' + dayjs(values?.voucherDate).format('MM'),
    date: values.voucherDate,
    project_id: values.projectId,
    letter_ref_no: values.letterReferenceNo,
    narration: values.narration,
    ledger_folio_number: 0,
    project_financial_year_id: 0,
    receiver_type_id: 0,
    voucher_type_id: 0,
    voucher_category_id: 0,
    status_id:0,
    bank_id: values.bank_id,
    items: values.items.map((item, index) => ({
      ordinal: index + 1,
      amount: item.amount,
      account_head_id: item.account_head_id,
      purpose: item.name,
      payment_type_id: values.paymentType,
      ref_number: values.paymentRef,
      item_id: item.id,
      donor_id : values.donor_type_id,
    })),
    voucher_files: project_files
  };
};
