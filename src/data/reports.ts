import dayjs from 'dayjs';
import { UserSubModule } from 'types/auth';
import { getUserModuleData, SubModuleButtonEnum, SubModuleEnum, UserModuleEnum } from 'utils/modules';

enum ProjectChildEnum {
  PROJECT_REPORT = 'project_report',
  FOR_ANNUAL_TRIAL_BALANCE_REPORT = 'for_annual_trial_balance_report',
  QUARTERLY_TRIAL_BALANCE_REPORT = 'quarterly_trial_balance_report',
  MONTHLY_TRIAL_BALANCE_REPORT = 'monthly_trial_balance_report',
  CASHBOOK_REPORT = 'cashbook_report',
  LEDGER_REPORT = 'ledger_report',
  UTILIZATION_REPORT_12_C = 'utilization_report_12_c',
  UTILIZATION_REPORT_12_A = 'utilization_report_12_a',
  SANCTION_ORDER_REPORT = 'sanction_order_report'
}
enum PayrollChildEnum {
  MY_PAYROLL = 'my_payroll'
}
export interface IReportLayoutChild {
  id: number;
  key: ProjectChildEnum | PayrollChildEnum;
  label: string;
  checked: boolean;
  enabled: boolean;
  hasMonth: boolean;
  hasYear: boolean;
  hasFinancialYear: boolean;
  hasProjectId: boolean;
  hasMonthRange: boolean;
  hasDate: boolean;
  endPoint: string;
}

export interface IReportsLayout {
  id: number;
  title: string;
  enabled: boolean;
  children: IReportLayoutChild[];
}

export const reportsMonthsRangeData = [
  { value: 1, label: 'January-March' },
  { value: 4, label: 'April-June' },
  { value: 7, label: 'July-September' },
  { value: 10, label: 'October-December' }
];

export const reportsMonthsData = Array.from({ length: 12 }, (_: any, i: number) => {
  const month = i + 1;
  const monthName = dayjs()
    .month(month - 1)
    .format('MMMM');
  return {
    value: month,
    label: monthName
  };
});

export const reportsYearsData = Array.from({ length: 10 }, (_: any, i: number) => {
  const year = dayjs().year() - i;
  return {
    value: +year,
    label: year
  };
});
const createVoucherModule = getUserModuleData(UserModuleEnum.Reports, SubModuleEnum.Reports.Projects)! as UserSubModule;
const payrolVoucherModule = getUserModuleData(UserModuleEnum.Reports, SubModuleEnum.Reports.Payroll)! as UserSubModule;
const getPermission = (buttonEnum: number, subModule: UserSubModule) =>
  subModule?.sub_module_button.find((button) => button.sub_module_button === buttonEnum);

export const reportsLayouts: IReportsLayout[] = [
  // {
  //   id: 1,
  //   title: 'Account',
  //   enabled: true,
  //   children: [
  //     {
  //       id: 1,
  //       key: AccountChildEnum.PROJECT_REPORT,
  //       label: 'Project Report \n',
  //       checked: false,
  //       enabled: true,
  //       hasMonth: false,
  //       hasYear: false,
  //       hasFinancialYear: false,
  //       hasProjectId: false,
  //       hasMonthRange: false
  //     }
  //   ]
  // },
  {
    id: 1,
    title: 'Projects',
    enabled: Boolean(createVoucherModule?.access),
    children: [
      {
        id: 1,
        key: ProjectChildEnum.PROJECT_REPORT,
        label: 'Project Report \n',
        checked: false,
        hasDate: false,
        enabled: getPermission(SubModuleButtonEnum.Reports.Projects.AnnualReport, createVoucherModule)!?.access,
        hasMonth: false,
        hasYear: false,
        hasFinancialYear: true,
        hasProjectId: true,
        hasMonthRange: false,
        endPoint: '/main/generate/annual/report/'
      },
      {
        id: 2,
        key: ProjectChildEnum.FOR_ANNUAL_TRIAL_BALANCE_REPORT,
        label: 'For Annual Trial Balance Report',
        checked: false,
        hasDate: false,
        enabled: getPermission(SubModuleButtonEnum.Reports.Projects.AnnualTrialBalanceReport, createVoucherModule)!?.access,
        hasMonth: false,
        hasYear: false,
        hasFinancialYear: true,
        hasProjectId: true,
        hasMonthRange: false,
        endPoint: '/main/generate/annual/trial/balance/report/'
      },
      {
        id: 3,
        key: ProjectChildEnum.QUARTERLY_TRIAL_BALANCE_REPORT,
        label: 'Quarterly Trial Balance Report',
        checked: false,
        hasDate: false,
        enabled: getPermission(SubModuleButtonEnum.Reports.Projects.QuaterlyTrialBalanceReport, createVoucherModule)!?.access,
        hasProjectId: true,
        hasMonth: true,
        hasYear: false,
        hasFinancialYear: true,
        hasMonthRange: true,
        endPoint: '/main/generate/quartarly/trial/balance/report/'
      },
      {
        id: 4,
        key: ProjectChildEnum.MONTHLY_TRIAL_BALANCE_REPORT,
        label: 'Monthly Trial Balance Report',
        checked: false,
        hasDate: false,
        enabled: getPermission(SubModuleButtonEnum.Reports.Projects.MonthlyTrialBalanceReport, createVoucherModule)!?.access,
        hasMonth: true,
        hasYear: false,
        hasFinancialYear: true,
        hasProjectId: true,
        hasMonthRange: false,
        endPoint: '/main/generate/monthly/trial/balance/report/'
      },
      {
        id: 5,
        key: ProjectChildEnum.CASHBOOK_REPORT,
        label: 'Cashbook Report',
        checked: false,
        hasDate: true,
        enabled: getPermission(SubModuleButtonEnum.Reports.Projects.CashBookReport, createVoucherModule)!?.access,
        hasMonth: false,
        hasYear: false,
        hasFinancialYear: false,
        hasProjectId: true,
        hasMonthRange: false,
        endPoint: '/main/generate/cash/book/report/'
      },
      {
        id: 6,
        key: ProjectChildEnum.LEDGER_REPORT,
        label: 'Ledger Report',
        checked: false,
        hasDate: true,
        enabled: getPermission(SubModuleButtonEnum.Reports.Projects.LedgerReport, createVoucherModule)!?.access,
        hasMonth: false,
        hasYear: false,
        hasFinancialYear: false,
        hasProjectId: true,
        hasMonthRange: false,
        endPoint: '/main/generate/ledger/report/'
      },
      {
        id: 7,
        key: ProjectChildEnum.UTILIZATION_REPORT_12_C,
        label: 'Utilization Report 12-C',
        checked: false,
        hasDate: false,
        enabled: getPermission(SubModuleButtonEnum.Reports.Projects.UtitilizationReport12C, createVoucherModule)!?.access,
        hasMonth: false,
        hasYear: false,
        hasFinancialYear: true,
        hasProjectId: true,
        hasMonthRange: false,
        endPoint: '/main/generate/12-c/utitilization/report/'
      },
      {
        id: 8,
        key: ProjectChildEnum.UTILIZATION_REPORT_12_A,
        label: 'Utilization Report 12-A',
        checked: false,
        hasDate: false,
        enabled: getPermission(SubModuleButtonEnum.Reports.Projects.UtitilizationReport12A, createVoucherModule)!?.access,
        hasMonth: false,
        hasYear: false,
        hasFinancialYear: true,
        hasProjectId: true,
        hasMonthRange: false,
        endPoint: '/main/generate/12-a/utitilization/report/'
      },
      {
        id: 9,
        key: ProjectChildEnum.SANCTION_ORDER_REPORT,
        label: 'Sanction Order Report',
        checked: false,
        hasDate: false,
        enabled: getPermission(SubModuleButtonEnum.Reports.Projects.SanctionOrderReport, createVoucherModule)!?.access,
        hasMonth: false,
        hasYear: false,
        hasFinancialYear: true,
        hasProjectId: true,
        hasMonthRange: false,
        endPoint: '/main/generate/sanction/order/report/'
      }
    ]
  },
  {
    id: 2,
    title: 'Payroll',
    enabled: Boolean(payrolVoucherModule?.access),
    children: [
      {
        id: 1,
        key: PayrollChildEnum.MY_PAYROLL,
        label: 'Payroll By Month / Year',
        checked: false,
        enabled: getPermission(SubModuleButtonEnum.Reports.Payroll.PayrollReport, payrolVoucherModule)!?.access,
        hasMonth: true,
        hasYear: true,
        hasFinancialYear: false,
        hasProjectId: false,
        hasMonthRange: false,
        hasDate: false,
        endPoint: '/payroll/generate/paybill/report/'
      }
    ]
  }
];
