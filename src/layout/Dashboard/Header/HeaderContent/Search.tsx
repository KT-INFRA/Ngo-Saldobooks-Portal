// material-ui
import Box from '@mui/material/Box';

// assets
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
// import { Chip } from '@mui/material';
// import useAuth from 'hooks/useAuth';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

export default function Search() {
  // const { user } = useAuth();
  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 2 } }}>
      <Stack direction={'row'} gap={1} alignItems={'center'}>
        {/* <Typography color="black" variant="subtitle1">
          Welcome
        </Typography>
        <Typography color={'primary'} variant="h4">
          {user?.prefix + ' ' + user?.user_first_name}
        </Typography>
        <Chip label={user?.user_type_name} variant="combined" size="small" /> */}
        <Typography color="black" variant="h5">
          {'PAYIR TRUST'.toUpperCase()}
        </Typography>
      </Stack>
      {/* <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <OutlinedInput
          id="header-search"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchNormal1 size={16} />
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{ 'aria-label': 'weight' }}
          placeholder="Ctrl + K"
          sx={{ '& .MuiOutlinedInput-input': { p: 1.5 } }}
        />
      </FormControl> */}
    </Box>
  );
}

// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Button from '@mui/material/Button';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
// import Typography from '@mui/material/Typography';

// const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: theme.palette.common.white,
//     color: 'rgba(0, 0, 0, 0.87)',
//     boxShadow: theme.shadows[1],
//     fontSize: 11,
//   },
// }));

// const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
//   <Tooltip {...props} arrow classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .${tooltipClasses.arrow}`]: {
//     color: theme.palette.common.black,
//   },
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: theme.palette.common.black,
//   },
// }));

// const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: '#FFFF',
//     width: 220,
//     fontSize: theme.typography.pxToRem(12),
//     border: '1px solid',
//     borderColor: '#dcdcdc',
//   },
// }));

// export default function CustomizedTooltips() {
//   return (
//     <div>
//       <LightTooltip title="Add">
//         <Button>Light</Button>
//       </LightTooltip>
//       <BootstrapTooltip title="Add">
//         <Button>Bootstrap</Button>
//       </BootstrapTooltip>
//       <HtmlTooltip
//         arrow
//         title={
//           <React.Fragment>
//             <List>
//               <ListItem>1. Karthikeyan</ListItem>
//               <ListItem>2. Duraisamy</ListItem>
//             </List>
//             <Button varient="contained">Click me</Button>
//           </React.Fragment>
//         }
//       >
//         <Button>HTML</Button>
//       </HtmlTooltip>
//     </div>
//   );
// }
