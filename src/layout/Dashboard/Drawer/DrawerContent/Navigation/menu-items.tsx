import { useState, useMemo, useCallback } from 'react';
import { useSignalEffect } from '@preact/signals-react';
import { FormattedMessage } from 'react-intl';
import { UserModuleEnum, SubModuleEnum } from 'utils/modules';
import { UserModule } from 'types/auth';
import { NavItemType } from 'types/menu';
import { useModuleSignal } from 'api/auth';
import {
  Bank,
  Box,
  Briefcase,
  Category,
  ChartSquare,
  Document,
  DocumentDownload,
  DocumentText,
  DocumentUpload,
  Home3,
  Money,
  MoneyChange,
  Setting2,
  TransactionMinus,
  User
} from 'iconsax-react';

const icons = {
  home: Home3,
  projects: Briefcase
};

const settingsIcons = {
  home: Home3,
  settings: Setting2,
  uploadPayBillExcel: DocumentUpload,
  generatePayslip: DocumentText,
  downloadPayslip: DocumentDownload,
  manageEmployees: User,
  manageVendors: Box,
  manageAccountHead: Box,
  manageTax: Box,
  manageFundingAgencies: Money,
  manageProjectCategory: Category,
  manageOwnBankAccounts: Bank
};
const reportsIcons = {
  reports: ChartSquare
};

const accountsIcons = {
  home: Home3,
  accounts: Money,
  createvoucher: Document,
  creditvoucher: DocumentDownload,
  debitvoucher: DocumentUpload,
  journalvoucher: TransactionMinus,
  viewadvance: Money,
  viewinternalloan: MoneyChange
};

const payrollIcons = {
  home: Home3,
  payroll: Money,
  uploadPayBillExcel: DocumentUpload,
  generatePayslip: DocumentText,
  downloadPayslip: DocumentDownload
};

const useGetMenuItems = () => {
  const [modules, setModules] = useState<UserModule[]>([]);

  const getAccess = useCallback((modules: UserModule[], moduleId: number) => {
    return modules.find((module) => module.module_id === moduleId);
  }, []);

  // Memoize the projectModule, payrollModule, etc.
  const projectModule = useMemo(() => getAccess(modules, UserModuleEnum.Projects), [getAccess, modules]);
  const payrollModule = useMemo(() => getAccess(modules, UserModuleEnum.Payroll), [getAccess, modules]);
  const accountModule = useMemo(() => getAccess(modules, UserModuleEnum.Accounts), [getAccess, modules]);
  const settingsModule = useMemo(() => getAccess(modules, UserModuleEnum.Settings), [getAccess, modules]);
  const reportsModule = useMemo(() => getAccess(modules, UserModuleEnum.Reports), [getAccess, modules]);

  // Memoize the settingsAccessChild and other submodules access maps
  const settingsAccessChild = useMemo<{ [key: number]: boolean }>(() => {
    if (!settingsModule?.sub_module) return {};

    return settingsModule.sub_module.reduce(
      (acc, submodule) => {
        acc[submodule.sub_module_id] = submodule?.access;
        return acc;
      },
      {} as { [key: number]: boolean }
    );
  }, [settingsModule?.sub_module]);

  const payslipAccessChild = useMemo<{ [key: number]: boolean }>(() => {
    if (!payrollModule?.sub_module) return {};

    return payrollModule.sub_module.reduce(
      (acc, submodule) => {
        acc[submodule.sub_module_id] = submodule?.access;
        return acc;
      },
      {} as { [key: number]: boolean }
    );
  }, [payrollModule?.sub_module]);

  const accountAccessChild = useMemo<{ [key: number]: boolean }>(() => {
    if (!accountModule?.sub_module) return {};

    return accountModule.sub_module.reduce(
      (acc, submodule) => {
        acc[submodule.sub_module_id] = submodule?.access;
        return acc;
      },
      {} as { [key: number]: boolean }
    );
  }, [accountModule?.sub_module]);

  // Only update modules when value changes
  useSignalEffect(() => {
    const newModules = useModuleSignal?.value as UserModule[];
    setModules((prevModules) => (prevModules !== newModules ? newModules : prevModules));
  });

  // Memoize the return value to avoid recalculation on every render
  const items = useMemo(() => {
    return [
      {
        id: 'group-dashboard-loading',
        type: 'group',
        children: [
          {
            id: 'dashboard',
            title: <FormattedMessage id="dashboard" />,
            type: 'item',
            icon: icons.home,
            url: '/dashboard',
            breadcrumbs: false
          },
          projectModule?.access && {
            id: 'projects',
            title: <FormattedMessage id="projects" />,
            type: 'item',
            icon: icons.projects,
            url: '/projects',
            breadcrumbs: false
          },
          accountModule?.access && {
            id: 'group-accounts-loading',
            title: <FormattedMessage id="accounts" />,
            icon: accountsIcons.accounts,
            type: 'collapse',
            children: [
              {
                id: 'createvoucher',
                title: <FormattedMessage id="createvoucher" />,
                type: 'item',
                icon: accountsIcons.createvoucher,
                disabled: accountAccessChild[SubModuleEnum.Accounts.CreateVoucher] === false,
                url: '/accounts/createvoucher'
              },
              {
                id: 'viewvoucher',
                title: <FormattedMessage id="View Voucher" />,
                type: 'item',
                icon: accountsIcons.createvoucher,
                // disabled: accountAccessChild[SubModuleEnum.Accounts.CreditVoucher] === false,
                // disabled: accountAccessChild[SubModuleEnum.Accounts.CreditVoucher] === false,
                disabled: false,
                url: '/accounts/viewvoucher'
              },
              {
                id: 'viewadvance',
                title: <FormattedMessage id="viewadvance" />,
                type: 'item',
                icon: accountsIcons.viewadvance,
                disabled: accountAccessChild[SubModuleEnum.Accounts.ViewAdvances] === false,
                url: '/accounts/viewadvance'
              },
              {
                id: 'viewinternalloan',
                title: <FormattedMessage id="viewinternalloan" />,
                type: 'item',
                icon: accountsIcons.viewinternalloan,
                disabled: accountAccessChild[SubModuleEnum.Accounts.ViewInternalLoan] === false,
                url: '/accounts/viewinternalloan'
              }
            ].filter((_) => _?.disabled === false) as NavItemType[]
          },
          payrollModule?.access && {
            id: 'group-payroll-loading',
            title: <FormattedMessage id="payroll" />,
            icon: payrollIcons.payroll,
            type: 'collapse',
            children: [
              {
                id: 'uploadPayBillExcel',
                title: <FormattedMessage id="uploadPayBillExcel" />,
                type: 'item',
                icon: payrollIcons.uploadPayBillExcel,
                url: '/payroll/uploadPayBillExcel',
                breadcrumbs: false,
                disabled:
                  payslipAccessChild[SubModuleEnum.Payroll.UploadPayBillExcel] === false ||
                  payslipAccessChild[SubModuleEnum.Payroll.GeneratePayslip] === false
              },
              {
                id: 'myPayslip',
                title: <FormattedMessage id="myPayslip" />,
                type: 'item',
                icon: payrollIcons.downloadPayslip,
                url: '/payroll/myPayslip',
                breadcrumbs: false,
                disabled: payslipAccessChild[SubModuleEnum.Payroll.DownloadPayslip] === false
              }
            ].filter((_) => _?.disabled === false) as NavItemType[]
          },
          settingsModule?.access && {
            id: 'group-settings-loading',
            title: <FormattedMessage id="settings" />,
            icon: settingsIcons?.settings,
            type: 'collapse',
            children: [
              {
                id: 'manageEmployees',
                title: <FormattedMessage id="manageemployees" />,
                type: 'item',
                icon: settingsIcons?.manageEmployees,
                disabled: settingsAccessChild[SubModuleEnum.Settings.ManageEmployees] === false,
                url: '/settings/manageEmployees'
              },
              {
                id: 'manageVendors',
                title: <FormattedMessage id="managevendors" />,
                type: 'item',
                icon: settingsIcons?.manageVendors,
                disabled: settingsAccessChild[SubModuleEnum.Settings.ManageVendors] === false,
                url: '/settings/manageVendors'
              },
              {
                id: 'manageAccountHead',
                title: <FormattedMessage id="manageaccounthead" />,
                type: 'item',
                icon: settingsIcons?.manageAccountHead,
                disabled: settingsAccessChild[SubModuleEnum.Settings.ManageAccountHead] === false,
                url: '/settings/manageAccountHead'
              },
              {
                id: 'manageTax',
                title: <FormattedMessage id="managetax" />,
                type: 'item',
                icon: settingsIcons?.manageTax,
                disabled: settingsAccessChild[SubModuleEnum.Settings.ManageTax] === false,
                url: '/settings/manageTax'
              },
              {
                id: 'manageFundingAgencies',
                title: <FormattedMessage id="managefundingagencies" />,
                type: 'item',
                icon: settingsIcons?.manageFundingAgencies,
                disabled: settingsAccessChild[SubModuleEnum.Settings.ManageFundingAgencies] === false,
                url: '/settings/manageFundingAgencies'
              },
              {
                id: 'manageProjectCategory',
                title: <FormattedMessage id="Project Group" />,
                type: 'item',
                icon: settingsIcons?.manageProjectCategory,
                disabled: settingsAccessChild[SubModuleEnum.Settings.ManageProjectCategory] === false,
                url: '/settings/manageProjectCategory'
              },
              {
                id: 'manageOwnBankAccounts',
                title: <FormattedMessage id="manageownbankaccounts" />,
                type: 'item',
                icon: settingsIcons?.manageOwnBankAccounts,
                disabled: settingsAccessChild[SubModuleEnum.Settings.ManageOwnBankAccounts] === false,
                url: '/settings/manageOwnBankAccounts'
              }
            ].filter((_) => _?.disabled === false) as NavItemType[]
          },
          reportsModule?.access && {
            id: 'group-reports-loading',
            title: <FormattedMessage id="reports" />,
            icon: reportsIcons.reports,
            type: 'item',
            url: 'reports'
          }
        ].filter(Boolean) as NavItemType[]
      }
    ];
  }, [
    projectModule?.access,
    accountModule?.access,
    accountAccessChild,
    payrollModule?.access,
    payslipAccessChild,
    settingsModule?.access,
    settingsAccessChild,
    reportsModule?.access
  ]);

  return { items };
};

export default useGetMenuItems;
