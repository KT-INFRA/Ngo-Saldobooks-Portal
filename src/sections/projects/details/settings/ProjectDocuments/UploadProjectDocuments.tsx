// material-ui
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';

// assets

// types
import { DialogActions, Grid } from '@mui/material';
import { Button } from '@mui/material';
import FilePicker from '../ProjectDocuments/ProjectUpload/FilePicker';

import { FormikErrors } from 'formik';
import LoadingButton from 'components/@extended/LoadingButton';
import { SetStateAction } from 'react';

interface Props {
  file: File;
  isLoading: boolean;
  open: boolean;
  handleClose: () => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<FormikErrors<any>> | Promise<void>;
  handleValidateFile: () => void;
  handleUploadFile: () => void;
  isValidated: boolean;
  error: string;
}

export default function UploadPaySlipAlert({
  open,
  isLoading,
  handleClose,
  setFieldValue,
  handleValidateFile,
  file,
  isValidated,
  handleUploadFile
}: Props) {
  function setFile(value: SetStateAction<File | null>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1.5} alignItems="center">
              <FilePicker file={file} setFile={setFile} />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
        {isValidated ? (
          <LoadingButton
            loading={isLoading}
            variant="contained"
            onClick={() => {
              if (!isLoading) {
                handleUploadFile();
              }
            }}
            sx={{ mr: 1 }}
          >
            {'Upload'}
          </LoadingButton>
        ) : (
          <LoadingButton
            loading={isLoading}
            variant="contained"
            onClick={() => {
              if (!isLoading) {
                handleValidateFile();
              }
            }}
            sx={{ mr: 1 }}
          >
            {'Validate'}
          </LoadingButton>
        )}
        {/* <LoadingButton></LoadingButton> */}
      </DialogActions>
    </Dialog>
  );
}
