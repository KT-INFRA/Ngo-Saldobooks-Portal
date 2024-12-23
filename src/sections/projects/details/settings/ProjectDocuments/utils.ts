import { mimeTypes } from 'data/mimes'; // Adjust the mimeTypes path if necessary

interface FileObject {
  file: string;
  extension: string;
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

export const formateProjectDocumentPayload = async (
  values: { description: string; extensionFiles: File[] },
  projectId: number
) => {
  const project_files: FileObject[] = await getProjectFilesBase64(values.extensionFiles);
  return {
    project_documents: project_files.map((item) => ({
      project_id: projectId,
      description: values.description,
      file: item.file,
      extension: item.extension,
    })),
  };
};
