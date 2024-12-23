import { Button } from '@mui/material';
import { Box, Paper } from '@mui/material';
import { Card, CardActions, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Add, TickCircle } from 'iconsax-react';
import { SnackbarContent, useSnackbar } from 'notistack';
import { forwardRef, useCallback } from 'react';

const SnackbarBox = styled(SnackbarContent)({
  '@media (min-width:600px)': {
    minWidth: '344px !important'
  }
});

function CustomeMessage({ id, message, download }: any, ref: any) {
  const { closeSnackbar } = useSnackbar();

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  return (
    <SnackbarBox ref={ref}>
      <Card sx={{ bgcolor: 'success.main', width: '100%' }}>
        <CardActions sx={{ padding: '8px 8px 8px 16px', justifyContent: 'space-between' }}>
          <Typography color={'white'} variant="subtitle1">
            {message}
          </Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <IconButton sx={{ p: 1, transition: 'all .2s', backgroundColor: 'success.main' }} onClick={handleDismiss}>
              <Add color="#FFF" style={{ transform: 'rotate(45deg)' }} />
            </IconButton>
          </Box>
        </CardActions>
        <Paper sx={{ padding: 2, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <Typography gutterBottom>Report ready</Typography>
          <Button
            onClick={() => download()}
            size="small"
            startIcon={<TickCircle variant="Bold" style={{ fontSize: 16, marginTop: -2 }} />}
            sx={{ '&:hover': { bgcolor: 'transparent' } }}
          >
            Download
          </Button>
        </Paper>
      </Card>
    </SnackbarBox>
  );
}

export const CustomNotistack = forwardRef(CustomeMessage);
