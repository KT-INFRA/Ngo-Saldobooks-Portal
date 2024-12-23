import { Props } from './interface';
import { Main } from './Main';
import { FileProvider } from './FileContext';

export type FilePreviewProps = {
  file: File;
  index: number;
  remove: (file: File) => void;
};

export type FileIcon = {
  type: string;
  // icon: JSX.Element;
  color: string;
  image?: string;
};
export type FileFooterProps = {
  file: File;
  fileSrc: string | null;
  index: number;
  isImage: boolean;
  remove: (file: File) => void;
};

export const ReactFilesPreview: React.FC<Props> = (props) => {
  return (
    <FileProvider>
      <Main {...props} />
    </FileProvider>
  );
};
