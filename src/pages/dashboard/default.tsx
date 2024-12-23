// material-ui
import Grid from '@mui/material/Grid';

// assets
import { Activity } from 'iconsax-react';
import DashboardDataCard from 'sections/dashboard/default/DataCard';
import { ColorProps } from 'types/extended';
import AccountHeadExpenceChart from 'sections/dashboard/default/AccountHeadExpenceChart';
import FundingAgencyFundsChart from 'sections/dashboard/default/FundingAgencyFundsChart';
import LoanProvidersChart from 'sections/dashboard/default/LoanProviderschart';
import AdvancedAndSettledChart from 'sections/dashboard/default/AdvancedAndSettledChart';
import VoucherTypeChart from 'sections/dashboard/default/VoucherTypeChart';
import VoucherStatusChart from 'sections/dashboard/default/VoucherStatusChart';
import ProjectsTable from 'sections/dashboard/default/ProjectsTable';
import { useGetApprovedBudgets, useGetProjectCount } from 'api/dashboard';

// ==============================|| DASHBOARD ||============================== //

export interface CardLayoutTypes {
  title: string;
  budget: {
    EAP: number;
    AICRP: number;
  };
  type: string;
  color: ColorProps;
}

export default function DashboardDefault() {
  const { eapTotal: eapAb, aicrpTotal: aicrpAb } = useGetApprovedBudgets();
  const { eapTotal: eapCount, aicrpTotal: aicrpCount } = useGetProjectCount();
  const cardLayout = [
    {
      title: 'Approved Budget',
      budget: {
        EAP: eapAb,
        AICRP: aicrpAb
      },
      type: 'amount',
      color: 'primary'
    },
    {
      title: 'Funds Received',
      budget: {
        EAP: 0,
        AICRP: 0
      },
      type: 'amount',
      color: 'success'
    },
    {
      title: 'Funds Spend',
      budget: {
        EAP: 0,
        AICRP: 0
      },
      type: 'amount',
      color: 'warning'
    },
    {
      title: 'Active Projects',
      budget: {
        EAP: eapCount,
        AICRP: aicrpCount
      },
      type: 'count',
      color: 'primary'
    }
  ] as CardLayoutTypes[];

  return (
    <div>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        {cardLayout?.map((card, index) => {
          return (
            <Grid item xs={12} sm={6} lg={3} key={`dc_${index}`}>
              <DashboardDataCard card={card} iconPrimary={<Activity />} />
            </Grid>
          );
        })}
        {/* row 2 */}
        <Grid item xs={12} md={12} lg={12}>
          <AccountHeadExpenceChart />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <FundingAgencyFundsChart />
            </Grid>
            <Grid item xs={12} md={7}>
              <LoanProvidersChart />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <ProjectsTable />
        </Grid>

        <Grid item xs={12}>
          <AdvancedAndSettledChart />
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <VoucherTypeChart />
            </Grid>
            <Grid item xs={12} md={7}>
              <VoucherStatusChart />
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </div>
  );
}
