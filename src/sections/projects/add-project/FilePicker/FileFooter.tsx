import { useContext, useEffect, useState } from 'react';
import { FileContext } from './FileContext';
import { Link, ToggleButtonGroup, Typography } from '@mui/material';
import { ToggleButton } from '@mui/material';
import { DocumentDownload, Trash } from 'iconsax-react';
import { Box } from '@mui/material';
import { Divider } from '@mui/material';
import { CardContent } from '@mui/material';
import { FileFooterProps } from './ReactFilesPreview';
const FileFooter: React.FC<FileFooterProps> = ({ file, fileSrc, index, isImage, remove }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fileSize, setFileSize] = useState<string | null>(null);

  useEffect(() => {
    if (file.size < 1000000) {
      setFileSize(Math.floor(file.size / 1000) + ' KB');
    } else {
      setFileSize(Math.floor(file.size / 1000000) + ' MB');
    }
  }, [file]);

  const nameArray = file.name.split('.');
  let fileName = nameArray[0];
  const extension = nameArray.pop();
  if (fileName.length > 20) {
    fileName = fileName.substring(0, 5) + '..' + fileName.substring(fileName.length - 3, fileName.length);
  }
  const result = fileName + '.' + extension;
  const componentState = useContext(FileContext).state.componentState;
  return (
    <>
      <CardContent sx={{ padding: 0 }}>
        <Box display={'flex'} flexDirection={'column'} px={2}>
          <Typography sx={{ fontSize: 11, fontWeight: 'bold', my: 0.5 }} variant="h6">
            {result}
          </Typography>
          {/* <Typography sx={{ fontSize: 10 }} variant="caption">
            {fileSize}
          </Typography> */}
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
      </CardContent>
      <ToggleButtonGroup
        fullWidth
        color="primary"
        exclusive
        aria-label="text alignment"
        size="small"
        sx={{
          // p: 1,
          '& .MuiToggleButton-root': {
            borderRadius: 0,
            p: 0.8,
            '&:not(.Mui-selected)': {
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent'
            },
            '&:first-of-type': {
              borderLeftColor: 'transparent'
            },
            '&:last-of-type': {
              borderRightColor: 'transparent'
            },
            '&:hover': {
              bgcolor: 'transparent',
              color: 'primary.main'
            }
          }
        }}
      >
        {componentState.downloadFile && fileSrc && (
          <ToggleButton
            LinkComponent={Link}
            value="android"
            aria-label="android"
            href={fileSrc as string}
            target="_blank"
            download={file?.name}
          >
            <DocumentDownload />
          </ToggleButton>
        )}
        <ToggleButton onClick={() => remove(file)} value="ios" aria-label="ios">
          <Trash />
        </ToggleButton>
      </ToggleButtonGroup>
      {/* result
fileSize */}
    </>
  );
};

export default FileFooter;
