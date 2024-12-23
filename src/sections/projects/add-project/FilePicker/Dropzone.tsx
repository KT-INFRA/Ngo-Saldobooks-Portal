import React from 'react';
import { Box } from '@mui/material';

interface DropzoneProps {
  height?: string;
  fileData: Array<any>;
  disabled?: boolean;
  handleDragOver?: React.DragEventHandler<HTMLDivElement>;
  handleDragLeave?: React.DragEventHandler<HTMLDivElement>;
  handleDrop?: React.DragEventHandler<HTMLDivElement>;
  children: React.ReactNode | React.ReactChild;
}

const Dropzone = ({ height, fileData, disabled, handleDragOver, handleDragLeave, handleDrop, children }: DropzoneProps) => {
  return (
    <Box
      sx={{
        overflow: height ? 'auto' : 'visible',
        height: height || 'auto',
        borderColor: fileData.length === 0 ? 'gray' : 'transparent',
        transition: 'backgroundColor 0.2s ease-in-out',
        '&:hover':
          fileData.length === 0 && !disabled
            ? {
                backgroundColor: 'primary.lighter'
              }
            : {},
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        p: fileData.length === 0 ? 6 : 2,
        backgroundColor: 'secondary.lighter'
      }}
      onDragOver={disabled ? undefined : handleDragOver}
      onDragLeave={disabled ? undefined : handleDragLeave}
      onDrop={disabled ? undefined : handleDrop}
      data-testid="dropzone"
    >
      {children}
    </Box>
  );
};

export default Dropzone;
