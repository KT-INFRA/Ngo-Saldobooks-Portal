/* eslint-disable jsx-a11y/alt-text */
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import MainCard from 'components/MainCard';

interface IVouchersDocumentsProps {
  handlePress: () => void;
  fileUrl: string;
}
export default function VouchersDocuments({ handlePress, fileUrl }: IVouchersDocumentsProps) {
  const fileName = fileUrl?.split('/').pop();
  return (
    <MainCard
      onClick={handlePress}
      content={false}
      border={true}
      sx={{
        padding: 1,
        borderRadius: 1,
        cursor: 'pointer',
        '&:hover': { backgroundColor: 'secondary.lighter', transform: 'scale(1.03)', transition: 'all .2s ease-in' }
      }}
    >
      <Stack gap={1} m={0} direction={'row'}>
        <Box>
          <img width={30} src={'https://img.icons8.com/color/200/pdf--v1.png'} />
        </Box>
        <Stack>
          <Typography
            variant="caption"
            sx={{
              wordBreak: 'break-all', // ensures long words will wrap
              overflowWrap: 'break-word', // allows wrapping at word boundaries
              whiteSpace: 'normal', // makes sure text can wrap
              maxWidth: '100%' // ensures it stays within the box width
            }}
          >
            {fileName}
          </Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
}
