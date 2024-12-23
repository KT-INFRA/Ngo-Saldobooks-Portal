// third-party
import { FormattedMessage } from 'react-intl';

// project-import

// assets
import {
  DocumentDownload,
  DocumentText,
  DocumentUpload,
  Home3,
  Money
  //  MoneyChange
} from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';
import { getUserModuleData, SubModuleEnum, UserModuleEnum } from 'utils/modules';
import { UserModule } from 'types/auth';

const icons = {
  home: Home3,
  payroll: Money,
  uploadPayBillExcel: DocumentUpload,
  generatePayslip: DocumentText,
  downloadPayslip: DocumentDownload
};

const uploadPayBillExcel = getUserModuleData(UserModuleEnum.Payroll, SubModuleEnum.Payroll.UploadPayBillExcel)! as UserModule;
const downloadPayslip = getUserModuleData(UserModuleEnum.Payroll, SubModuleEnum.Payroll.DownloadPayslip)! as UserModule;
const generatePayslip = getUserModuleData(UserModuleEnum.Payroll, SubModuleEnum.Payroll.GeneratePayslip)! as UserModule;
const payroll: NavItemType = {
  id: 'group-payroll-loading',
  title: <FormattedMessage id="payroll" />,
  icon: icons.payroll,
  type: 'collapse',
  children: [
    uploadPayBillExcel?.access || generatePayslip?.access
      ? {
          id: 'uploadPayBillExcel',
          title: <FormattedMessage id="uploadPayBillExcel" />,
          type: 'item',
          icon: icons.uploadPayBillExcel,
          url: '/payroll/uploadPayBillExcel',
          breadcrumbs: false
        }
      : null,
    downloadPayslip?.access
      ? {
          id: 'myPayslip',
          title: <FormattedMessage id="myPayslip" />,
          type: 'item',
          icon: icons.downloadPayslip,
          url: '/payroll/myPayslip',
          breadcrumbs: false
        }
      : null
  ].filter(Boolean) as NavItemType[]
};

export default payroll;
