import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavItemType } from 'types/menu';
import { getUserModuleData, UserModuleEnum } from 'utils/modules';

// Define the context type
type MenuContextType = {
  menuItems: NavItemType[];
  updateMenu: () => void;
};

// Create the MenuContext
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Custom hook to access menu context
export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};

// Provider to wrap the app
export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuItems, setMenuItems] = useState<NavItemType[]>([]);

  const updateMenu = () => {
    const accountsModule = getUserModuleData(UserModuleEnum.Accounts);
    const payrollModule = getUserModuleData(UserModuleEnum.Payroll);

    const dashboard = {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'group',
      children: [] // Add your dashboard items
    };

    const updatedItems = [
      dashboard,
      accountsModule?.access ? { id: 'accounts', title: 'Accounts', type: 'group', children: [] } : null,
      payrollModule?.access ? { id: 'payroll', title: 'Payroll', type: 'group', children: [] } : null
    ].filter(Boolean) as NavItemType[];

    setMenuItems(updatedItems);
  };

  useEffect(() => {
    updateMenu();
    // Optionally: add event listeners for localStorage changes if needed
  }, []);

  return <MenuContext.Provider value={{ menuItems, updateMenu }}>{children}</MenuContext.Provider>;
};
