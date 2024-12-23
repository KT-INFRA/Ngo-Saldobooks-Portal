// third-party
import { FormattedMessage } from 'react-intl';

// project-import

// assets
import { Document, DocumentDownload, DocumentUpload, Home3, Money, MoneyChange, TransactionMinus } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';
import { UserModule } from 'types/auth';
import { getUserModuleData, SubModuleEnum, UserModuleEnum } from 'utils/modules';

const icons = {
  home: Home3,
  accounts: Money,
  createvoucher: Document,
  creditvoucher: DocumentDownload,
  debitvoucher: DocumentUpload,
  journalvoucher: TransactionMinus,
  viewadvance: Money,
  viewinternalloan: MoneyChange
};

const voucherModule = getUserModuleData(UserModuleEnum.Accounts)! as UserModule;
const getPermission = (subModuleEnum: number) => voucherModule?.sub_module?.find((module) => module.sub_module_id === subModuleEnum);
const accounts: NavItemType = {
  id: 'group-accounts-loading',
  title: <FormattedMessage id="accounts" />,
  icon: icons.accounts,
  type: 'collapse',
  children: [
    {
      id: 'createvoucher',
      title: <FormattedMessage id="createvoucher" />,
      type: 'item',
      icon: icons.createvoucher,
      url: '/accounts/createvoucher',
      disabled: getPermission(SubModuleEnum.Accounts.CreateVoucher)?.access === false
    },
    {
      id: 'viewvoucher',
      title: <FormattedMessage id="View Voucher" />,
      type: 'item',
      icon: icons.createvoucher,
      url: '/accounts/viewvoucher'
    },
    {
      id: 'viewadvance',
      title: <FormattedMessage id="viewadvance" />,
      type: 'item',
      icon: icons.viewadvance,
      url: '/accounts/viewadvance'
    },
    {
      id: 'viewinternalloan',
      title: <FormattedMessage id="viewinternalloan" />,
      type: 'item',
      icon: icons.viewinternalloan,
      url: '/accounts/viewinternalloan'
    }
  ]
};

export default accounts;
