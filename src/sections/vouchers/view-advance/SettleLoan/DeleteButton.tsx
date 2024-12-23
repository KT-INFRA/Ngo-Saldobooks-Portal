import { ArrayHelpers, useFormikContext } from 'formik';
import { ISettleInitialValuesProps, SettleAdvanceItemProps } from '../SettleAdvanceModal';
import IconButton from 'components/@extended/IconButton';
import { AddCircle, Trash } from 'iconsax-react';
import { Stack } from '@mui/material';
import { generateUniqueId } from './utils';

interface AccountHeadSelectProps {
  items: SettleAdvanceItemProps[];
  employee_id: number;
  push: ArrayHelpers['push'];
  remove: ArrayHelpers['remove'];
}
function DeleteButton({ items, push, remove, employee_id }: AccountHeadSelectProps) {
  const { values } = useFormikContext<ISettleInitialValuesProps>();
  const handleAdd = () => {
    push({
      account_head_id: 0,
      amount: '',
      employee_id: employee_id,
      id: generateUniqueId(),
      isNew: true
    });
  };
  return (
    <>
      {items?.length > 0 ? (
        items?.map((item, index) => {
          const removeIndex = values?.items?.findIndex((p) => p.id === item.id);
          const lastIndex = index === items?.length - 1;
          return (
            <Stack gap={0.5} direction={'row'}>
              <IconButton
                key={index}
                onClick={() => {
                  remove(removeIndex);
                }}
                size="small"
              >
                {<Trash />}
              </IconButton>

              {lastIndex && (
                <IconButton onClick={handleAdd} size="small">
                  <AddCircle />
                </IconButton>
              )}
            </Stack>
          );
        })
      ) : (
        <IconButton onClick={handleAdd} size="small">
          <AddCircle />
        </IconButton>
      )}
    </>
  );
}

export default DeleteButton;
