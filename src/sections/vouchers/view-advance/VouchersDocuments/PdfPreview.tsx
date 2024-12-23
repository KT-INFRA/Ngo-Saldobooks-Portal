// material-ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Document, Page, pdfjs } from 'react-pdf';
// import './TableStyles.css';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';

// assets

// types
import { DialogActions, LinearProgress } from '@mui/material';
import { Button } from '@mui/material';
import { useMemo, useState } from 'react';
interface Props {
  isLoading?: boolean;
  open: boolean;
  pdfUrl: string;
  isInProgress: boolean;
  percentage: number;
  handleClose?: () => void;
  handleDownload: () => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
export default function PdfPreview({ open, pdfUrl, isLoading, handleClose, handleDownload, isInProgress, percentage }: Props) {
  const [pageNumber] = useState(1);
  const setNumPages = useState(1)[1];
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const fileOption = useMemo(
    () => ({
      url: pdfUrl
    }),
    [pdfUrl]
  );
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        TransitionComponent={PopupTransition}
        fullWidth
        aria-labelledby="column-delete-title"
        aria-describedby="column-delete-description"
      >
        {isInProgress && <LinearProgress variant="query" value={percentage} />}
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Document
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error('Error loading PDF:', error)}
            file={fileOption}
          >
            <Page renderTextLayer={false} renderAnnotationLayer={false} scale={1.2} className={'no-margin-page2'} pageNumber={pageNumber} />
          </Document>
        </DialogContent>
        <DialogActions>
          <Button color="error" variant="outlined" onClick={handleClose}>
            close
          </Button>
          <Button color="primary" variant="contained" onClick={handleDownload}>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
