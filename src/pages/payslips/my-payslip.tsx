import { useState, useMemo } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// project-imports
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';

// import projects from 'data/projects.json';

// types

// assets
import PaySlipCard from 'sections/payslips/my-payslip/PaySlipCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import PayslipPdfPreview from 'sections/payslips/my-payslip/PayslipPdfPreview';
import useDownlader from 'react-use-downloader';
import { useGetMyPayBill, useGetPaySlipPdfById, YearBasedData } from 'api/payroll';
import { Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import PaySlipCardSkeleton from 'sections/payslips/my-payslip/PaySlipCardSkeleton';

// ==============================|| PROJECT - CARD ||============================== //

export default function MyPayslip() {
  const { download, isInProgress, percentage } = useDownlader();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPayslip, setSelectedPayslip] = useState<any>({});

  const { data = [], isLoading } = useGetMyPayBill();
  //  console.log("DATA");
  //    console.log(data);
  const { getPayslipPdf, pdfUrl } = useGetPaySlipPdfById(selectedPayslip.id);
  // console.log("PDF");
  // console.log(pdfUrl);
  const handleClose = () => {
    setOpen(false);
  };
  const handlePress = async () => {
    await setOpen(true);
    await getPayslipPdf();
  };

  const handleDownload = () => {
    download(pdfUrl, selectedPayslip?.year_month + '.pdf');
  };
  let breadcrumbLinks = useMemo(() => [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'My Payslip' }], []);
  return (
    <>
      <Breadcrumbs custom title={false} heading={'My Payslips'} links={breadcrumbLinks} />
      <Grid container spacing={3}>
        <PaySlipCardSkeleton
          loading={isLoading}
          content={
            data.length > 0 ? (
              <MainCard sx={{ mt: 2, backgroundColor: 'transparent', border: 'none' }}>
                {data?.map((payslipData: YearBasedData, index: number) => (
                  <Stack>
                    <Typography variant="h4" mb={1}>
                      {payslipData.title}
                    </Typography>
                    <Grid container spacing={3} mb={1}>
                      {payslipData.data.length > 0 &&
                        payslipData.data.map((payslip) => {
                          return (
                            <Grid item xs={12} md={3}>
                              <PaySlipCard
                                handleDownload={handleDownload}
                                payslip={payslip}
                                file="k"
                                handlePress={() => {
                                  setSelectedPayslip(payslip);
                                  handlePress();
                                }}
                              />
                            </Grid>
                          );
                        })}
                    </Grid>
                  </Stack>
                ))}
              </MainCard>
            ) : (
              <EmptyUserCard title={''} />
            )
          }
        />
      </Grid>
      <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        {selectedPayslip && pdfUrl && (
          <PayslipPdfPreview
            open={open}
            handleClose={handleClose}
            pdfUrl={pdfUrl}
            handleDownload={handleDownload}
            isInProgress={isInProgress}
            percentage={percentage}
          />
        )}
      </Stack>
    </>
  );
}
