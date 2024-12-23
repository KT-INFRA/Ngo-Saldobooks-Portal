// third-party
import { FormattedMessage } from 'react-intl';

// project-import

// assets
import { DocumentDownload, DocumentText, DocumentUpload, Home3, Money, Setting2, User, Box, Bank, Category } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';
// import { getUserModuleData, SubModuleEnum, UserModuleEnum } from 'utils/modules';
const icons = {
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
const EmployeeAccess = true;
const vendorAccess = true;
const AccountHeadAccess = true;
const ManageTaxAccess = true;
const ManageFundingAgencyAccess = true;
const ManageProjectCategoryAccess = true;
const ManageBankAccountAccess = true;
// const mydatank: any = getUserModuleData(UserModuleEnum.Settings, SubModuleEnum.Settings.ManageEmployees.ManageEmployees);
//const { access: EmployeeAccess }: any = getUserModuleData(UserModuleEnum.Settings, SubModuleEnum.Settings.ManageEmployees.ManageEmployees);
const settings: NavItemType = {
  id: 'group-settings-loading',
  title: <FormattedMessage id="settings" />,
  icon: icons.settings,
  type: 'collapse',
  children: [
    ...(EmployeeAccess
      ? [
          {
            id: 'manageEmployees',
            title: <FormattedMessage id="manageemployees" />,
            type: 'item',
            icon: icons.manageEmployees,
            url: '/settings/manageEmployees'
          }
        ]
      : []),
    ...(vendorAccess
      ? [
          {
            id: 'manageVendors',
            title: <FormattedMessage id="managevendors" />,
            type: 'item',
            icon: icons.manageVendors,
            url: '/settings/manageVendors'
          }
        ]
      : []),
    ...(AccountHeadAccess
      ? [
          {
            id: 'manageAccountHead',
            title: <FormattedMessage id="manageaccounthead" />,
            type: 'item',
            icon: icons.manageAccountHead,
            url: '/settings/manageAccountHead'
          }
        ]
      : []),
    ...(ManageTaxAccess
      ? [
          {
            id: 'manageTax',
            title: <FormattedMessage id="managetax" />,
            //type: 'collapse',
            type: 'item',
            icon: icons.manageTax,
            url: '/settings/manageTax'
          }
        ]
      : []),
    ...(ManageFundingAgencyAccess
      ? [
          {
            id: 'manageFundingAgencies',
            title: <FormattedMessage id="managefundingagencies" />,
            type: 'item',
            icon: icons.manageFundingAgencies,
            url: '/settings/manageFundingAgencies'
          }
        ]
      : []),
    ...(ManageProjectCategoryAccess
      ? [
          {
            id: 'manageProjectCategory',
            //title: <FormattedMessage id="manageprojectcategory" />,
            title: <FormattedMessage id="Project Group" />,
            type: 'item',
            icon: icons.manageProjectCategory,
            url: '/settings/manageProjectCategory'
          }
        ]
      : []),
    ...(ManageBankAccountAccess
      ? [
          {
            id: 'manageOwnBankAccounts',
            title: <FormattedMessage id="manageownbankaccounts" />,
            type: 'item',
            icon: icons.manageOwnBankAccounts,
            url: '/settings/manageOwnBankAccounts'
          }
        ]
      : [])
  ]
};

export default settings;
