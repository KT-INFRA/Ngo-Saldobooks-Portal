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
  taxableAmount,
  account_head_id,
  onDeleteItem,
  onEditItem,
  handleChangeAccountHead,
  index,
  Blur,
  errors,
  touched,
  accountHeads,
  taxData,
  employees
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
  const accountHeadPath = `items[${index}].account_head_id`;
  const taxableAmountPath = `items[${index}].taxableAmount`;

  const textFieldItem = [
    {
      placeholder: 'Item name',
      label: 'Item Name',
      name: `items.${index}.name`,
      type: 'text',
      id: id + '_name',
      value: name,
      error: getIn(errors, namePath),
      touched: getIn(touched, namePath),
      disabled: false
    },
    {
      placeholder: 'Account Head',
      label: 'Account Head',
      name: `items.${index}.account_head_id`,
      type: 'select',
      id: id + '_account_head',
      value: account_head_id,
      error: getIn(errors, accountHeadPath),
      touched: getIn(touched, accountHeadPath),
      disabled: false
    },
    {
      placeholder: '',
      label: 'taxableAmount',
      type: 'number',
      name: `items.${index}.taxableAmount`,
      id: id + '_taxableAmount',
      value: taxableAmount,
      error: getIn(errors, taxableAmountPath),
      touched: getIn(touched, taxableAmountPath),
      disabled: false
    },
    {
      placeholder: '',
      label: 'gst',
      type: 'text',
      name: `items.${index}.gst`,
      id: id + '_gst',
      value: taxData?.gstAmount ?? 0,
      error: '',
      touched: false,
      disabled: true,
      dense: true
    },
    {
      placeholder: '',
      label: 'tds',
      type: 'text',
      name: `items.${index}.tds`,
      id: id + '_tds',
      value: taxData?.tdsAmount ?? 0,
      error: '',
      touched: false,
      disabled: true,
      dense: true
    },
    {
      placeholder: '',
      label: 'netAmount',
      type: 'text',
      name: `items.${index}.netAmount`,
      id: id + '_netAmount',
      value: taxData?.netAmount ?? 0,
      error: '',
      touched: false,
      disabled: true,
      dense: true
    },
    {
      placeholder: '',
      label: 'totalAmount',
      type: 'text',
      name: `items.${index}.totalAmount`,
      id: id + '_totalAmount',
      value: taxData?.totalAmount ?? 0,
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
            handleChangeAccountHead={handleChangeAccountHead}
            onBlur={(event: any) => Blur(event)}
            cellData={{
              placeholder: item.placeholder,
              name: item.name,
              type: item.type,
              id: item.id,
              value: item.value,
              error: item.error,
              touched: item.touched,
              disabled: item.disabled,
              dense: item.dense ?? false
            }}
            employees={employees}
            accountHeads={accountHeads}
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
