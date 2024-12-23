import { useEffect, useState } from 'react';
import FileFooter from './FileFooter';
import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { filePreviewStyle } from './FilePreviewStyle';
import { Box } from '@mui/material';
import { FilePreviewProps } from './ReactFilesPreview';

const imageFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/tiff'];

const FilePreview: React.FC<FilePreviewProps> = ({ file, index, remove }) => {
  const [fileSrc, setFileSrc] = useState<string | null>(null);
  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFileSrc(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    }
  }, [file]);
  const previewStyle = filePreviewStyle.filter((item) => item.type === file.type);
  return (
    <Grid item sm={4} xs={8} md={3}>
      <MainCard content={false} sx={{ minHeight: '100%' }}>
        <Box sx={{ p: 1, height: 140, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
          {imageFileTypes.includes(file.type) ? (
            <img src={fileSrc as string} alt={''} style={{ height: '100%', width: '100%', borderRadius: 5 }} />
          ) : previewStyle.length > 0 ? (
            <img src={previewStyle[0]?.image as string} alt={''} style={{ width: '60%', borderRadius: 5 }} />
          ) : (
            <img src="https://img.icons8.com/color/200/document--v1.png" alt="" style={{ width: '60%', borderRadius: 5 }} />
          )}
        </Box>
        {fileSrc && <FileFooter remove={remove} file={file} fileSrc={fileSrc} index={index} isImage={imageFileTypes.includes(file.type)} />}
      </MainCard>
    </Grid>
  );
};

export default FilePreview;
