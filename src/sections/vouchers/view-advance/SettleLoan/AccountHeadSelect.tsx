import { Autocomplete, TextField } from '@mui/material';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import { ISettleInitialValuesProps, SettleAdvanceItemProps } from '../SettleAdvanceModal';

interface AccountHeadSelectProps {
  accountHeads: { label: string; value: number }[];
  items: SettleAdvanceItemProps[];
}
function AccountHeadSelect({ accountHeads, items }: AccountHeadSelectProps) {
  const { setFieldValue, values, errors, touched } = useFormikContext<ISettleInitialValuesProps>();
  return items?.map((item) => {
    const selectedAccountHead = () => accountHeads.find((p) => p.value === item.account_head_id);
    const changeIndex = values?.items?.findIndex((p) => p.id === item.id);
    const accountHead = `items[${changeIndex}].account_head_id`;
    const hasError = getIn(errors, accountHead);
    const isTouched = getIn(touched, accountHead);
    return (
      <div key={item.id}>
        <Autocomplete
          size="small"
          sx={{
            minWidth: 200
          }}
          onChange={(_e, accountHead) => {
            setFieldValue(`items[${changeIndex}].account_head_id`, accountHead?.value);
          }}
          multiple={false}
          defaultValue={selectedAccountHead()}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          id={`account_head_id-${item.id}`}
          options={accountHeads}
          renderInput={(params) => <TextField {...params} placeholder="Account Head" error={isTouched && hasError} />}
        />
      </div>
    );
  });
}

export default AccountHeadSelect;
