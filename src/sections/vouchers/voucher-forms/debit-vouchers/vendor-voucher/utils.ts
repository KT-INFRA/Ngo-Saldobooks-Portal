import { mimeTypes } from 'data/mimes';
import * as Yup from 'yup';

// Interfaces
export interface Item {
  id: number;
  name: string;
  account_head_id: number;
  taxableAmount: number;
}

export interface InitialValues {
  vendorId: number;
  projectId: number;
  letterReferenceNo: string;
  narration: string;
  gst: number;
  tds: number;
  items: Item[];
  projectFiles: File[];
  bank_id?: number; // updated to number
}

export type FormValues = {
  [key: string]: any;
};

// Initial Form Values
export const initialValues: InitialValues = {
  vendorId: 0,
  projectId: 0,
  letterReferenceNo: '',
  gst: 0,
  tds: 0,
  narration: '',
  bank_id: undefined, // updated from '' to undefined
  items: [
    {
      id: 1,
      name: '',
      account_head_id: 0,
      taxableAmount: 0
    }
  ],
  projectFiles: []
};

// Validation Schemas
export const firstStepValidationSchema = Yup.object({
  vendorId: Yup.number().optional(),
  tds: Yup.number(),
  gst: Yup.number(),
  projectId: Yup.number().optional(),
  bank_id: Yup.number().optional(), // remains correct
  narration: Yup.string().required('Narration is required'),
  letterReferenceNo: Yup.string().optional(),
});

export const secondStepValidationSchema = Yup.object({
  items: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().optional(),
      account_head_id: Yup.number().optional(),
      taxableAmount: Yup.number().optional()
    })
  )
});

export const combinedValidationSchema = firstStepValidationSchema.concat(secondStepValidationSchema);

// Tax Calculation
export const getTaxData = (taxablePrice: number = 0, gst: string | number, tds: string | number) => {
  const gstPercent = +gst || 0;
  const tdsPercent = +tds || 0;

  const gstAmount = parseFloat(((taxablePrice * gstPercent) / 100).toFixed(2));
  const tdsAmount = Math.round((taxablePrice * tdsPercent) / 100);
  const taxAmount = taxablePrice + gstAmount;

  const netAmount = parseFloat(((taxablePrice + gstAmount) - tdsAmount).toFixed(2));
  const totalAmount = parseFloat(taxAmount.toFixed(2));

  return {
    gstAmount,
    tdsAmount,
    totalAmount,
    netAmount
  };
};

// File Handling
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

// Payload Formatter
export const formateCreateVoucherPayload = async ({
  values,
  gstPercent,
  tdsPercent
}: {
  values: InitialValues;
  gstPercent: any;
  tdsPercent: any;
}) => {
  const project_files: FileObject[] = await getProjectFilesBase64(values.projectFiles);

  return {
    business_id: 1,
    user_id: 1,
    project_id: values.projectId === 0 ? null : values.projectId,
    letter_ref_no: values.letterReferenceNo,
    narration: values.narration,
    receiver_type_id: 2,
    bank_id: values.bank_id ?? null, // use null if undefined
    items: values.items.map((item, index) => {
      const { tdsAmount, gstAmount, totalAmount } = getTaxData(item.taxableAmount, gstPercent, tdsPercent);
      return {
        beneficiary_id: values.vendorId,
        amount: totalAmount,
        purpose: item.name,
        ordinal: index + 1,
        account_head_id: item.account_head_id,
        tds: {
          tax_id: values.tds,
          tax_amount: tdsAmount
        },
        gst: {
          tax_id: values.gst,
          tax_amount: gstAmount
        }
      };
    }),
    voucher_files: project_files
  };
};
