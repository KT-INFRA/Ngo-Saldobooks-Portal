// third-party
import { FormattedMessage } from 'react-intl';

// project-import

// assets
import {
  ChartSquare
  // FavoriteChart
} from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

const icons = {
  accounts: ChartSquare,
  projects: ChartSquare,
  payrolls: ChartSquare,
  reports: ChartSquare
};

const reports: NavItemType = {
  id: 'group-reports-loading',
  title: <FormattedMessage id="reports" />,
  icon: icons.reports,
  type: 'item',
  url: 'reports'
};

export default reports;
