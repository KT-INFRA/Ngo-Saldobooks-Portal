import { mimeTypes } from 'data/mimes';
import dayjs from 'dayjs';
import { UserProfile } from 'types/auth';
import storage from 'utils/storage';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { user_id, business_id }: UserProfile = storage.getItem('user');

export const extensionInitialValues = {
  approvalDate: dayjs().format('YYYY-MM-DD'),
  approvalReference: '',
  extDuration: 0, // In Month
  extensionFiles: []
};
export interface IExtensionInitialValuesProps {
  approvalDate: string;
  approvalReference: string;
  extDuration: number;
  extensionFiles: File[];
}

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

export const formateProjectExtensionPayload = async (values: IExtensionInitialValuesProps, projectId: number) => {
  const project_files: FileObject[] = await getProjectFilesBase64(values.extensionFiles);
  return {
    project_id: projectId,
    approval_reference: values?.approvalReference,
    ext_duration: values?.extDuration,
    project_extension_files: project_files,
    approval_date: values?.approvalDate
  };
};
