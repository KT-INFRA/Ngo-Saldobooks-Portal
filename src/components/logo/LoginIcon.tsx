// material-ui
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/system';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

import logo from 'assets/images/logo.png';
import { ThemeMode } from 'config';
// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();
  return (
    <Stack direction={'row'} alignItems={'center'} gap={1}>
      <img src={theme.palette.mode === ThemeMode.DARK ? logo : logo} alt="icon logo" width="80" />
      <Typography textAlign={'left'} color="text.black" variant="h5" textTransform={'uppercase'}>
        {'Institute of Forest Genetics and Tree Breeding'}
      </Typography>
    </Stack>
  );
}
