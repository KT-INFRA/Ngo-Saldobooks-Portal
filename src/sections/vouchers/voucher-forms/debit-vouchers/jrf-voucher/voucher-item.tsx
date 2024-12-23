import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableCell from '@mui/material/TableCell';

// third-party
import { getIn } from 'formik';

// project-imports
import VoucherField from './voucher-field';

import { ThemeMode } from 'config';
// import { openSnackbar } from 'api/snackbar';

// assets
import { Trash } from 'iconsax-react';

// types
// import { SnackbarProps } from 'types/snackbar';

// ==============================|| VOUCHER - ITEMS ||============================== //

export default function VoucherItem({
  id,
  name,
  amount,
  net_amount,
  onDeleteItem,
  onEditItem,
  handleChangeSelectvalue,
  index,
  Blur,
  errors,
  touched,
  employees,
  beneficiary_id,
  licence_fees,
  electricity_fees,
  water_fees,
  fellowship_fees
}: any) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useState(false);
  const handleModalClose = (status: boolean) => {
    setOpen(false);
    if (status) {
      onDeleteItem(index);
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleModalClose(true);
  };

  const namePath = `items[${index}].name`;
  const employeePath = `items[${index}].beneficiary_id`;
  const amountPath = `items[${index}].amount`;

  const textFieldItem = [
    {
      placeholder: 'Employee',
      label: 'Employee',
      name: `items.${index}.beneficiary_id`,
      type: 'select',
      id: id + '_beneficiary_id',
      value: beneficiary_id,
      error: getIn(errors, employeePath),
      touched: getIn(touched, employeePath),
      options: employees,
      selectLabel: 'Select Employee',
      defaultValue: employees.find((employee: any) => employee.value === beneficiary_id) ?? null
    },
    {
      placeholder: 'Item name',
      label: 'Item Name',
      name: `items.${index}.name`,
      type: 'text',
      id: id + '_name',
      value: name,
      error: getIn(errors, namePath),
      touched: getIn(touched, namePath)
    },
    {
      placeholder: '',
      label: 'amount',
      // type: 'number',
      name: `items.${index}.amount`,
      id: id + '_amount',
      value: amount,
      error: getIn(errors, amountPath),
      touched: getIn(touched, amountPath),
      dense: true
    },
    {
      placeholder: '',
      label: 'licence_fees',
      // type: 'number',
      name: `items.${index}.licence_fees`,
      id: id + '_licence_fees',
      value: licence_fees,
      error: '',
      touched: false,
      disabled: Boolean(amount <= 0),
      dense: true
    },
    {
      placeholder: '',
      label: 'electricity_fees',
      // type: 'number',
      name: `items.${index}.electricity_fees`,
      id: id + '_electricity_fees',
      value: electricity_fees,
      error: '',
      touched: false,
      disabled: Boolean(amount <= 0),
      dense: true
    },
    {
      placeholder: '',
      label: 'water_fees',
      // type: 'number',
      name: `items.${index}.water_fees`,
      id: id + '_water_fees',
      value: water_fees,
      error: '',
      touched: false,
      disabled: Boolean(amount <= 0),
      dense: true
    },
    {
      placeholder: '',
      label: 'fellowship_fees',
      // type: 'number',
      name: `items.${index}.fellowship_fees`,
      id: id + '_fellowship_fees',
      value: fellowship_fees,
      error: '',
      touched: false,
      disabled: Boolean(amount <= 0),
      dense: true
    },
    {
      placeholder: '',
      label: 'net_amount',
      type: 'text',
      name: `items.${index}.net_amount`,
      id: id + '_net_amount',
      value: net_amount,
      error: '',
      touched: false,
      disabled: true,
      dense: true
    }
  ];
  return (
    <>
      {textFieldItem.map((item: any) => {
        return (
          <VoucherField
            onEditItem={(event: any) => onEditItem(event)}
            handleChangeSelectvalue={handleChangeSelectvalue}
            onBlur={(event: any) => Blur(event)}
            cellData={{
              placeholder: item.placeholder,
              name: item.name,
              type: item.type,
              id: item.id,
              value: item.value,
              error: item.error,
              touched: item.touched,
              dense: item.dense ?? false,
              disabled: item.disabled ?? false
            }}
            selectedOption={item.defaultValue}
            selectPlaceholder={item.selectLabel}
            options={item.options}
            key={item.label}
          />
        );
      })}
      <TableCell align="center">
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                opacity: 0.9
              }
            }
          }}
          title="Remove Item"
        >
          <Button color="error" onClick={handleButtonClick}>
            <Trash />
          </Button>
        </Tooltip>
      </TableCell>
    </>
  );
}
