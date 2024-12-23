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
      <img src={theme.palette.mode === ThemeMode.DARK ? logo : logo} alt="icon logo" width="50" />
      <Stack direction={'column'} alignItems={'left'}>
        <Typography
          textAlign={'justify'}
          fontWeight={'bold'}
          justifyContent={'center'}
          color="text.black"
          variant="body2"
          fontSize={'large'}
        >
          {/* {'Institute of Forest Genetics'}
          <br />
          {'and Tree Breeding'} */}
          {'Van Lekha'}
        </Typography>
      </Stack>
    </Stack>
  );
}
