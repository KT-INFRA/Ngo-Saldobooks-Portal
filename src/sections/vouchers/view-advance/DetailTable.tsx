import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useViewAdvanceContext } from 'pages/vouchers/view-advance/view-advance-context';
import { formateCurrency } from 'utils/currency';
import { Divider, Stack, Typography } from '@mui/material';
import { Personalcard } from 'iconsax-react';
import SettleAmountText from './SettleLoan/SettleAmountText';

export default function SettleTable() {
  const { advanceDetail } = useViewAdvanceContext()!;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = advanceDetail?.advance_details || [];
  return (
    <Table size="small" sx={{ mt: 2 }}>
      <TableHead>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>Employee</TableCell>
          <TableCell>Advance Amount</TableCell>
          <TableCell>Account Head</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data?.map((advance) => {
          const items = advance.settled_details?.filter((item) => item.voucher_employee_id === advance?.id);
          return (
            <TableRow
              key={advance?.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 }
              }}
            >
              <TableCell component="th" scope="row">
                {advance?.ordinal}
              </TableCell>
              <TableCell component="th" scope="row">
                {advance?.beneficiary_name}
              </TableCell>
              <TableCell>{formateCurrency(Number(advance?.amount))}</TableCell>
              <TableCell>
                <Stack direction={'column'} gap={0.5}>
                  {items?.length > 0 ? (
                    items?.map((item, index) => {
                      // return <TextField value={item?.account_head_name} size="small" />;
                      return (
                        <Stack direction={'row'} gap={1}>
                          <Personalcard size={20} />
                          <Typography variant="body1">
                            {/* {index + 1}.  */}
                            {item?.account_head_name}
                          </Typography>
                          <Divider />
                        </Stack>
                      );
                    })
                  ) : (
                    <Typography variant="body1">-</Typography>
                  )}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction={'column'} gap={0.5}>
                  {items?.length > 0 ? (
                    items?.map((item) => {
                      return <Typography variant="body1">{formateCurrency(item?.bill_amount)}</Typography>;
                    })
                  ) : (
                    <Typography variant="body1">-</Typography>
                  )}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction={'column'} gap={0.5}>
                  <SettleAmountText keyField="bill_amount" items={advance?.settled_details! || []} advanceAmount={+advance.amount} />
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
