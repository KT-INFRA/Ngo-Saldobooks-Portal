import { UserSubModule } from 'types/auth';
import { getUserModuleData, SubModuleButtonEnum, SubModuleEnum, UserModuleEnum } from 'utils/modules';

export interface IVoucherField {
  id: number;
  label: string;
  field: string;
  type?: 'input' | 'select' | 'date' | 'textarea';
}
export interface IVoucherItems {
  item: number;
  account_head: number;
  amount: number;
  hasAccess?: boolean;
}
export interface IVoucherType {
  id: number;
  name: string;
  fields?: IVoucherField[];
  children?: IVoucherType[];
  hasAccess?: boolean;
}

const createVoucherModule = getUserModuleData(UserModuleEnum.Accounts, SubModuleEnum.Accounts.CreateVoucher)! as UserSubModule;

const getPermission = (buttonEnum: number) =>
  createVoucherModule.sub_module_button.find((button) => button.sub_module_button === buttonEnum);

export const VoucherTypes: IVoucherType[] = [
  {
    id: 1,
    name: 'Credit Voucher',
    children: [
      {
        id: 1,
        name: 'Credit Voucher for Funding Agency',
        hasAccess: getPermission(SubModuleButtonEnum.Accounts.CreateVoucher.GeneralCreditVoucher)?.access
      },
      {
        id: 2,
        name: 'Credit Voucher for Bank Interest',
        hasAccess: getPermission(SubModuleButtonEnum.Accounts.CreateVoucher.CreditVoucherForBankInterest)?.access
      },
      {
        id: 3,
        name: 'Credit Voucher for Other Sources',
        hasAccess: getPermission(SubModuleButtonEnum.Accounts.CreateVoucher.CreditVoucherForOtherSource)?.access
      }
    ]
  },
  {
    id: 2,
    name: 'Debit Voucher',
    children: [
      {
        id: 1,
        name: 'Debit Voucher for Vendor',
        hasAccess: getPermission(SubModuleButtonEnum.Accounts.CreateVoucher.DebitVoucherForVendor)?.access
      },
      {
        id: 2,
        name: 'Debit Voucher for Employee/JRF',
        hasAccess: getPermission(SubModuleButtonEnum.Accounts.CreateVoucher.DebitVoucherForEmployeeJRF)?.access
      },
      {
        id: 3,
        name: 'Debit Voucher for JRF Fellowship',
        hasAccess: getPermission(SubModuleButtonEnum.Accounts.CreateVoucher.DebitVoucherForJRFellowship)?.access
      },
      {
        id: 4,
        name: 'Debit Voucher for Bank Interest Transfer',
        hasAccess: getPermission(SubModuleButtonEnum.Accounts.CreateVoucher.DebitVoucherForBankInterestTransfer)?.access
      },
      {
        id: 5,
        name: 'Debit Voucher for Project-Project',
        hasAccess: getPermission(SubModuleButtonEnum.Accounts.CreateVoucher.DebitVoucherForProjectToProject)?.access
      },
      {
        id: 6,
        name: 'Debit Voucher for Bank-Charges',
        hasAccess: getPermission(SubModuleButtonEnum.Accounts.CreateVoucher.DebitVoucherForBankCharges)?.access
      }
    ]
  },
  {
    id: 3,
    name: 'Advance Mngt',
    children: [
      {
        id: 1,
        name: 'Issue Advance to Employee/JRF',
        hasAccess: getPermission(SubModuleButtonEnum.Accounts.CreateVoucher.IssueAdvanceToEmployeeJRF)?.access
      }
    ]
  },
  {
    id: 4,
    name: 'Internal Loan',
    children: [
      {
        id: 1,
        name: 'Issue Internal Loan',
        hasAccess: getPermission(SubModuleButtonEnum.Accounts.CreateVoucher.IssueInternalLoan)?.access
      }
    ]
  }
];
