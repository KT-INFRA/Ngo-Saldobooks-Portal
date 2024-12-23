// third-party
import { FormattedMessage } from 'react-intl';

// project-import

// assets
import { Briefcase, Home3 } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';
import accounts from './accounts';
import payroll from './payroll';
import settings from './settings';
import reports from './reports';
import { getUserModuleData, UserModuleEnum } from 'utils/modules';

const icons = {
  home: Home3,
  projects: Briefcase
};

const projectModule = getUserModuleData(UserModuleEnum.Projects)!;
const payrollModule = getUserModuleData(UserModuleEnum.Payroll)!;
const accountModule = getUserModuleData(UserModuleEnum.Accounts)!;

const getDashboardItems = (): NavItemType => {
  return {
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
      ...(projectModule?.access
        ? [
            {
              id: 'projects',
              title: <FormattedMessage id="projects" />,
              type: 'item',
              icon: icons.projects,
              url: '/projects',
              breadcrumbs: false
            }
          ]
        : []),
      ...(accountModule?.access ? [accounts] : []),
      ...(payrollModule?.access ? [payroll] : []),
      settings,
      reports
    ].filter(Boolean) as NavItemType[]
  };
};

export default getDashboardItems;
