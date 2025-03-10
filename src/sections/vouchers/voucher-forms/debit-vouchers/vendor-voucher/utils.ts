import { mimeTypes } from 'data/mimes';
import * as Yup from 'yup';

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
  bank_id: string;
}

export type FormValues = {
  // Define your form values type here
  [key: string]: any;
};

export const initialValues: InitialValues = {
  vendorId: 0,
  projectId: 0,
  letterReferenceNo: '',
  gst: 0,
  tds: 0,
  narration: '',
  bank_id: '',
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

export const firstStepValidationSchema = Yup.object({
  vendorId: Yup.number().optional(),
  // tds: Yup.number().required('TDS is required').min(1, 'Please select a valid TDS'),
  tds: Yup.number(),
  // gst: Yup.number().required('GST is required').min(1, 'Please select a valid GST'),
  gst: Yup.number(),
  // projectId: Yup.number().required('Project ID is required').min(1, 'Please select a valid Project ID'),
  projectId: Yup.number().optional(),
  bank_id: Yup.string().required('Bank ID is required'),
  // letterReferenceNo: Yup.string().required('Letter Reference Number is required'),
  narration: Yup.string().required('Narration is required'),
  letterReferenceNo: Yup.string().optional(),
  // narration: Yup.string().optional(),
  
});

export const secondStepValidationSchema = Yup.object({
  items: Yup.array()
    .of(
      Yup.object().shape({
        // name: Yup.string().required('Item Name is required'),
        name: Yup.string().optional(),
        // account_head_id: Yup.number().required('Account Head ID is required').min(1, 'Please select a valid Account Head ID'),
        account_head_id : Yup.number().optional(),
        // taxableAmount: Yup.number().required('Tax Amount is required').min(1, 'Tax Amount must be greater than 0'),
        taxableAmount : Yup.number().optional()
      })
    )
    
}); 

export const combinedValidationSchema = firstStepValidationSchema.concat(secondStepValidationSchema);

// export const getTaxData = (taxablePrice: number = 0, gst: string | number, tds: string | number) => {
// const gstPercent = +gst || 0;
// const tdsPercent = +tds || 0;
// const gstAmount = (taxablePrice * gstPercent) / 100;
// const tdsAmount = (taxablePrice * tdsPercent) / 100;
// const taxAmount = taxablePrice + gstAmount;
// const totalAmount = taxAmount;
// console.log(totalAmount);
// const netAmount = Math.max(0, taxAmount - tdsAmount);
// console.log(netAmount)
//   return {
//     gstAmount: gstAmount,
//     tdsAmount: tdsAmount,
//     netAmount: netAmount,
//     totalAmount: totalAmount
//   };
// };

// export const getTaxData = (taxablePrice: number = 0, gst: string | number, tds: string | number) => {
//   const gstPercent = +gst || 0;
//   const tdsPercent = +tds || 0;
//   const gstAmount = parseFloat(((taxablePrice * gstPercent) / 100).toFixed(2));
//   const tdsAmount = Math.round((taxablePrice * tdsPercent) / 100);
//   const taxAmount = Math.round(taxablePrice + gstAmount);
//   const totalAmount = taxAmount;
//   const netAmount = Math.max(0, taxAmount - tdsAmount);
//   return {
//     gstAmount,
//     tdsAmount,
//     totalAmount,
//     netAmount
//   };
// };

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
    number: 0,
    ledger_folio_number: 0,
    date: "2000-09-12",
    project_financial_year_id: 15,
    voucher_type_id: 0,
    voucher_category_id: 0,
    status_id: 0,
    user_id: 1,
    project_id: values.projectId === 0 ? null : values.projectId,
    // project_id: values.projectId,
    letter_ref_no: values.letterReferenceNo,
    narration: values.narration,
    receiver_type_id: 2, // for vendor,
    bank_id: values.bank_id,
    items: values.items.map((item, index) => {
      const { tdsAmount, gstAmount, totalAmount } = getTaxData(item.taxableAmount, gstPercent, tdsPercent);
      return {
        ordinal: index + 1,
        beneficiary_id: values.vendorId,
        // beneficiary_id: 15,
        amount: totalAmount,
        account_head_id: item.account_head_id,
        purpose: item.name,
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
