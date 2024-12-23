import { lazy } from 'react';

// project-imports
import ErrorBoundary from './ErrorBoundary';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import { FormattedMessage } from 'react-intl';
import PrivateRoutes from './ProtectedRoutes';
import Reports from 'pages/reports/my-reports';
import { getUserModuleData, SubModuleEnum, UserModuleEnum } from 'utils/modules';
import { Navigate } from 'react-router';
import { UserModule } from 'types/auth';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

//voucher
const CreateVoucher = Loadable(lazy(() => import('pages/vouchers/create')));
const CreditVoucher = Loadable(lazy(() => import('pages/vouchers/CreditVoucher')));
const ViewVoucher = Loadable(lazy(() => import('pages/vouchers/ViewVoucherScreen')));
const ViewInternalLoan = Loadable(lazy(() => import('pages/vouchers/view-internal-loan/view-internal-loan')));
const ViewAdvance = Loadable(lazy(() => import('pages/vouchers/view-advance/view-advance')));

//voucher

//UploadPayslip
const UploadPayslip = Loadable(lazy(() => import('pages/payslips/upload-payslip')));
const MyPayslip = Loadable(lazy(() => import('pages/payslips/my-payslip')));

//masters
const EmployeeListPage = Loadable(lazy(() => import('pages/masters/employees')));
const VendorListPage = Loadable(lazy(() => import('pages/masters/vendors')));
const ProjectGroupPage = Loadable(lazy(() => import('pages/masters/ProjectGroup')));
const AccountHeadPage = Loadable(lazy(() => import('pages/masters/AccountHead')));
const FundingAgencyPage = Loadable(lazy(() => import('pages/masters/FundingAgency')));
const TaxPage = Loadable(lazy(() => import('pages/masters/Tax')));
const OwnBankAccount = Loadable(lazy(() => import('pages/masters/OwnBankAccount')));
// render - widget
const WidgetStatistics = Loadable(lazy(() => import('pages/widget/statistics')));
const WidgetData = Loadable(lazy(() => import('pages/widget/data')));
const WidgetChart = Loadable(lazy(() => import('pages/widget/chart')));

// render - applications
const ProjectsList = Loadable(lazy(() => import('pages/projects/card')));
const ProjectDetails = Loadable(lazy(() => import('pages/projects/project-details-context')));

// render - charts & map
const ChartApexchart = Loadable(lazy(() => import('pages/charts/apexchart')));
const ChartOrganization = Loadable(lazy(() => import('pages/charts/org-chart')));
// pages routing
const AuthLogin = Loadable(lazy(() => import('pages/auth/auth1/login')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/auth1/forgot-password')));
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
// ==============================|| MAIN ROUTES ||============================== //

const projectModule = getUserModuleData(UserModuleEnum.Projects)!;

const uploadPayBillExcel = getUserModuleData(UserModuleEnum.Payroll, SubModuleEnum.Payroll.UploadPayBillExcel)! as UserModule;
const downloadPayslip = getUserModuleData(UserModuleEnum.Payroll, SubModuleEnum.Payroll.DownloadPayslip)! as UserModule;
const generatePayslip = getUserModuleData(UserModuleEnum.Payroll, SubModuleEnum.Payroll.GeneratePayslip)! as UserModule;

const MainRoutes = {
  path: '/',
  element: <PrivateRoutes />,
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/dashboard',
          element: <DashboardDefault />,
          breadcrumbs: false
        },
        {
          path: 'projects',
          children: [
            {
              index: true,
              element: projectModule?.access ? <ProjectsList /> : <Navigate to="/" />,
              errorElement: <ErrorBoundary />
            },
            {
              path: 'details',
              element: <ProjectDetails />,
              errorElement: <ErrorBoundary />
            }
          ]
        },
        {
          path: 'accounts',
          children: [
            {
              path: 'createvoucher',
              element: <CreateVoucher />
            },
            {
              path: 'viewVoucher',
              element: <ViewVoucher />
            },
            {
              path: 'creditvoucher',
              // element: <FormattedMessage id="creditvoucher" />
              element: <CreditVoucher />
            },
            {
              path: 'debitvoucher',
              element: <FormattedMessage id="debitvoucher" />
            },
            {
              path: 'journalvoucher',
              element: <FormattedMessage id="journalvoucher" />
            },
            {
              path: 'viewadvance',
              element: <ViewAdvance />
            },
            {
              path: 'viewinternalloan',
              element: <ViewInternalLoan />
            }
          ]
        },
        {
          path: 'payroll',
          children: [
            ...(uploadPayBillExcel?.access
              ? [
                  {
                    path: 'uploadPayBillExcel',
                    element: <UploadPayslip />
                  }
                ]
              : []),
            ...(downloadPayslip?.access || generatePayslip?.access
              ? [
                  {
                    path: 'myPayslip',
                    element: <MyPayslip />
                  }
                ]
              : [])
          ]
        },
        {
          path: 'settings',
          children: [
            {
              path: 'manageEmployees',
              element: <EmployeeListPage />
            },
            {
              path: 'manageVendors',
              element: <VendorListPage />
            },
            {
              path: 'manageAccountHead',
              element: <AccountHeadPage />
            },
            {
              path: 'manageTax',
              element: <TaxPage />
            },
            {
              path: 'manageFundingAgencies',
              element: <FundingAgencyPage />
            },
            {
              path: 'manageProjectCategory',
              element: <ProjectGroupPage />
            },
            {
              path: 'manageOwnBankAccounts',
              element: <OwnBankAccount />
            }
          ]
        },
        {
          path: 'reports',
          element: <Reports />
        },

        // ------------------------------------------
        {
          path: 'widget',
          children: [
            {
              path: 'statistics',
              element: <WidgetStatistics />
            },
            {
              path: 'data',
              element: <WidgetData />
            },
            {
              path: 'chart',
              element: <WidgetChart />
            }
          ]
        },
        {
          path: 'charts',
          children: [
            {
              path: 'apexchart',
              element: <ChartApexchart />
            },
            {
              path: 'org-chart',
              element: <ChartOrganization />
            }
          ]
        }
      ]
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        }
      ]
    },
    {
      path: '/auth',
      element: <PagesLayout />,
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        }
      ]
    },
    { path: '*', element: <MaintenanceError /> }
  ]
};

export default MainRoutes;
