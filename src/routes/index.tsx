import { createBrowserRouter } from 'react-router-dom';

// project-imports
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

// render - landing page

// ==============================|| ROUTES RENDER ||============================== //

const router = createBrowserRouter([LoginRoutes, MainRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });

export default router;
