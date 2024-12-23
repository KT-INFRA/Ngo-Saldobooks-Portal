import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useViewAdvanceContext } from 'pages/vouchers/view-advance/view-advance-context';
import { formateCurrency } from 'utils/currency';
import { FieldArray, useFormikContext } from 'formik';
import { useGetAccountHeadCommon } from 'api/voucher';
import { Stack } from '@mui/material';
import { ISettleInitialValuesProps } from '../SettleAdvanceModal';
import AccountHeadSelect from './AccountHeadSelect';
import AmountField from './AmountField';
import DeleteButton from './DeleteButton';
import { generateInitialItem } from './utils';
import SettleAmountText from './SettleAmountText';

export default function SettleTable() {
  const { advanceDetail } = useViewAdvanceContext()!;
  const { accountHeads } = useGetAccountHeadCommon();
  const { values, setFieldValue } = useFormikContext<ISettleInitialValuesProps>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = advanceDetail?.advance_details || [];

  useEffect(() => {
    if (data?.length > 0) {
      const initialItems = generateInitialItem(data);
      setFieldValue('items', initialItems?.items);
    }
  }, [data, setFieldValue]);
  return (
    <FieldArray name="items">
      {({ push, remove }) => {
        return (
          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Advance Amount</TableCell>
                <TableCell>Account Head</TableCell>
                <TableCell>Bill Amount</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell>Diff. Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((advance) => {
                const isSettled = Boolean(advance?.employee_settle_status);
                const items = values?.items?.filter((item) => item.employee_id === advance?.id);
                return (
                  <TableRow
                    key={advance?.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      opacity: isSettled ? 0.5 : 1,
                      pointerEvents: isSettled ? 'none' : 'auto'
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
                        <AccountHeadSelect accountHeads={accountHeads} items={items} />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction={'column'} gap={0.5}>
                        <AmountField items={items} />
                      </Stack>
                    </TableCell>
                    <TableCell align="left">
                      <Stack direction="column" gap={1.5}>
                        <DeleteButton employee_id={advance?.id} items={items} push={push} remove={remove} />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <SettleAmountText keyField="amount" advanceAmount={+advance.amount} items={items} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        );
      }}
    </FieldArray>
  );
}
