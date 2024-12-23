import { Grid } from '@mui/material';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useGetProjectInternalLoan } from 'api/project';
import { formateCurrency } from 'utils/currency';
import { useGetProjectDetailsContext } from 'pages/projects/utils';

export default function LoanDashboard() {
  // Fetch the data
  const { projectId } = useGetProjectDetailsContext()!;
  const { loanDashboard, isLoading } = useGetProjectInternalLoan(projectId);

  // Extract values dynamically
  const approvedBudget =
    loanDashboard.find((item: any) => item.voucher_type === "Credit")?.total_amount || 0;
  const grantReceived =
    loanDashboard.find((item: any) => item.voucher_type === "Debit")?.total_amount || 0;

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={4} sx={{ px: 3, py: 2 }}>
      {/* Analytics Section */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <AnalyticEcommerce
              title="Internal Loan Issued"
              count={formateCurrency(approvedBudget)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <AnalyticEcommerce
              title="Internal Loan Received"
              count={formateCurrency(grantReceived)}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
