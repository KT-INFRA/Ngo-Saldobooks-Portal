// material-ui
import { styled, SxProps } from '@mui/material/styles';
import Box from '@mui/material/Box';

// third-party
import { useDropzone } from 'react-dropzone';

// types
import FilePickerPlaceholder from './FilePickerPlaceholder';
import { Theme } from '@mui/material/styles';

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.paper,
  border: '1px dashed',
  borderColor: theme.palette.secondary.main,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

// ==============================|| UPLOAD - SINGLE FILE ||============================== //

type FilePickerTypes = {
  file: File;
  setFieldValue: (field: string, value: any) => void;
  sx?: SxProps<Theme>;
};

export default function FilePicker({ file, setFieldValue, sx }: FilePickerTypes) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    onDrop: (acceptedFiles: File[]) => {
      setFieldValue('file', acceptedFiles[0]);
    },
    onDragEnter: () => {
      setFieldValue('file', null);
      setFieldValue('isValidated', false);
    },
    onFileDialogOpen: () => {
      setFieldValue('file', null);
      setFieldValue('isValidated', false);
    }
  });

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropzoneWrapper
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...(file && { padding: '12% 0' })
        }}
      >
        <input {...getInputProps()} />
        <FilePickerPlaceholder file={file as any} />
      </DropzoneWrapper>
    </Box>
  );
}
