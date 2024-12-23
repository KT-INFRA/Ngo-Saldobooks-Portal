import { Alert, Grid, Stack, Typography } from '@mui/material';
import VouchersDocumentsCard from './VouchersDocumentsCard';
import { jwtDecode } from 'jwt-decode';
import useModal from 'hooks/useModal';
import PdfPreview from './PdfPreview';
import { useState } from 'react';
import useDownloader from 'react-use-downloader';
import { MessageQuestion } from 'iconsax-react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

export interface VouchersDocumentsProps {
  lists: string[];
  title: string;
  showPreviewVoucherAlert?: boolean;
}
function VouchersDocuments({ lists, title, showPreviewVoucherAlert = false }: VouchersDocumentsProps) {
  const [selectedDocument, setSelectedDocument] = useState('');
  const navigate = useNavigate();
  const { openModal, closeModal, open } = useModal();
  const handleCloseModal = () => {
    closeModal();
    setSelectedDocument('');
  };

  const handleDownload = () => {
    download(selectedDocument, selectedDocument.split('/').pop()!);
  };

  const { download, isInProgress, percentage } = useDownloader();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Stack gap={1}>
          <Typography variant="h5">{title}</Typography>
          <Grid container spacing={1}>
            {lists?.length > 0 ? (
              [...lists].map((document) => {
                // console.log(document);
                const data: { path: string } = jwtDecode(document);
                const path = data?.path!;
                return (
                  <Grid item xs={4} md={4}>
                    <VouchersDocumentsCard
                      fileUrl={path}
                      handlePress={() => {
                        setSelectedDocument(path);
                        openModal();
                      }}
                    />
                  </Grid>
                );
              })
            ) : showPreviewVoucherAlert ? (
              <Stack sx={{ width: '100%', ml: 1, mt: 1 }}>
                <Alert
                  variant="standard"
                  color="primary"
                  icon={<MessageQuestion />}
                  action={
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        navigate('/accounts/viewvoucher');
                      }}
                    >
                      View
                    </Button>
                  }
                >
                  View voucher to generate PDF
                </Alert>
              </Stack>
            ) : null}
          </Grid>
        </Stack>
      </Grid>
      <PdfPreview
        open={open}
        handleClose={handleCloseModal}
        pdfUrl={selectedDocument}
        handleDownload={handleDownload}
        isInProgress={isInProgress}
        percentage={percentage}
      />
    </Grid>
  );
}

export default VouchersDocuments;
