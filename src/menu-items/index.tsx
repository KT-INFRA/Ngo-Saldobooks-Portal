// project-imports
import getDashboardItems from './dashboard';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //
const menuItems = (): { items: NavItemType[] } => ({
  items: [getDashboardItems()]
});

export default menuItems;
