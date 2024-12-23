import { Typography } from '@mui/material';
import { formateCurrency } from 'utils/currency';

interface SettleAmountTextProps<T> {
  items: T[];
  advanceAmount: number;
  keyField: keyof T; // Accept any key from the array items
}

function SettleAmountText<T extends Record<string, any>>({ items, advanceAmount, keyField }: SettleAmountTextProps<T>) {
  const currentAmount = items.reduce((acc, cur) => acc + Number(cur[keyField] || 0), 0);
  const differenceAmount = +advanceAmount - currentAmount;

  return <Typography>{formateCurrency(currentAmount > 0 ? differenceAmount : 0)}</Typography>;
}

export default SettleAmountText;
