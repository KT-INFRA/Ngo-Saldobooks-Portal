import { CardContent } from '@mui/material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import { Calendar, Eye } from 'iconsax-react';

interface IPaySlipCardProps {
  payslip: {
    designation: string;
    year_month: string;
    id: number;
  };
  file: string;
  handlePress: (id: number) => void;
  handleDownload: (data: { url: string; fileName: string }) => void;
}
export default function PaySlipCard({ payslip: { id, designation, year_month }, handlePress, handleDownload }: IPaySlipCardProps) {
  return (
    <Box onClick={() => handlePress(id)}>
      <MainCard
        content={false}
        border={true}
        secondary={
          <IconButton>
            <Eye />
          </IconButton>
        }
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // backgroundColor: 'white',
          backgroundColor: 'primary.lighter',
          border: '1px solid',
          borderColor: 'primary.200',
          transition: 'all .2s ease-in',
          '&:hover': {
            transform: 'scale(1.020)'
          },
          cursor: 'pointer',

          // '&:after': {
          //   content: '""',
          //   background: `url("${cardBack}") 100% / cover no-repeat`,
          //   position: 'absolute',
          //   top: 0,
          //   left: 0,
          //   right: 0,
          //   bottom: 0,
          //   zIndex: 1,
          //   opacity: 0.5
          // }
          position: 'relative',

          '&:before, &:after': {
            content: '""',
            width: 1,
            height: 1,
            position: 'absolute',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.0001) 22.07%, rgba(255, 255, 255, 0.15) 83.21%)',
            transform: 'matrix(0.9, 0.44, -0.44, 0.9, 0, 0)'
          },
          '&:after': { top: '50%', right: '-20px' },
          '&:before': { right: '-70px', bottom: '80%' }
        }}
      >
        <CardContent>
          <Stack gap={2} m={0} direction={'row'}>
            <IconButton color="primary" variant="shadow">
              <Calendar />
            </IconButton>
            <Box>
              <Typography variant="h5">{year_month}</Typography>
              <Stack>
                <Typography variant="caption" color="#31343C">
                  {designation}
                </Typography>
                {/* <Typography variant="subtitle1" color="#FFFF">
                {formateCurrency(1000)}
              </Typography> */}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </MainCard>
    </Box>
  );
}
