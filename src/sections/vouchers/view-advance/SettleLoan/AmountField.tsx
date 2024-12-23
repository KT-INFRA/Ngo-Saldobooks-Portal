import { TextField } from '@mui/material';
import { getIn, useFormikContext } from 'formik';
import { ISettleInitialValuesProps, SettleAdvanceItemProps } from '../SettleAdvanceModal';

interface AccountHeadSelectProps {
  items: SettleAdvanceItemProps[];
}

function AmountField({ items }: AccountHeadSelectProps) {
  const { handleChange, values, errors, touched } = useFormikContext<ISettleInitialValuesProps>();

  return items?.map((item) => {
    const changeIndex = values?.items?.findIndex((p) => p.id === item.id);
    const accountHead = `items[${changeIndex}].amount`;
    const hasError = getIn(errors, accountHead);
    const isTouched = getIn(touched, accountHead);
    return (
      <TextField
        key={item.id}
        size="small"
        onChange={handleChange(`items[${changeIndex}].amount`)}
        value={item?.amount}
        placeholder="Amount"
        type="number"
        name={`items[${changeIndex}].amount`}
        sx={{ width: 150 }}
        error={isTouched && hasError}
      />
    );
  });
}

export default AmountField;
