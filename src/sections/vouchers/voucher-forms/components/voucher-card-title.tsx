import { Stack, Typography } from '@mui/material';
import { ArrowRight2 } from 'iconsax-react';
import React, { FC } from 'react';

interface VoucherCardTitleProps {
  titleText: string;
  voucherType: string;
}

const VoucherCardTitle: FC<VoucherCardTitleProps> = ({ titleText, voucherType }) => {
  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      <Typography variant="body1" color={'text.secondary'}>
        {voucherType}
      </Typography>
      <ArrowRight2 size={12} />
      <Typography variant="h5" color={'primary'}>
        {titleText}
      </Typography>
    </Stack>
  );
};

export default VoucherCardTitle;
