// material-ui
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';
import logo from 'assets/images/Payir_Logo 1.png';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return <img src={theme.palette.mode === ThemeMode.DARK ? logo : logo} alt="icon logo" width="50" />;
}
