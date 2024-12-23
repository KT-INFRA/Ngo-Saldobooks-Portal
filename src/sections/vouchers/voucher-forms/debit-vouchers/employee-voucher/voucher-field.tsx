// material-ui
import { styled } from '@mui/material';
import { Popper } from '@mui/material';
import { Autocomplete } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';

// ==============================|| VOUCHER - TEXT FIELD ||============================== //

export default function VoucherField({ onEditItem, cellData, handleChangeSelectvalue, options, selectedOption, selectPlaceholder }: any) {
  const CustomPopper = styled(Popper)(({ theme }) => ({
    minWidth: 'max-content'
  }));
  return (
    <TableCell
    // sx={{ '& .MuiFormHelperText-root': { position: 'absolute', bottom: -20, ml: 0 } }}
    >
      {cellData?.type === 'select' ? (
        <>
          <Autocomplete
            PopperComponent={CustomPopper}
            sx={{
              '& .MuiInputBase-root': {
                height: '48px', // Match this height with your TextField height,
                minWidth: '250px',
                maxWidth: 'auto'
              },
              '& .MuiOutlinedInput-root': {
                padding: 0
              },
              '& .MuiAutocomplete-inputRoot': {
                padding: '0 14px' // Add padding to match the TextField's input padding
              }
            }}
            onChange={(e, item) => {
              handleChangeSelectvalue(cellData.name, item?.value ?? '');
            }}
            defaultValue={selectedOption}
            style={{ width: '100%' }}
            id={selectPlaceholder}
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={selectPlaceholder}
                error={cellData.touched && Boolean(cellData.error)}
                helperText={cellData.touched && cellData.error}
              />
            )}
          />
        </>
      ) : (
        <TextField
          type={cellData.type}
          placeholder={cellData.placeholder}
          name={cellData.name}
          id={cellData.id}
          value={cellData.type === 'number' ? (cellData.value > 0 ? cellData.value : '') : cellData.value}
          onChange={onEditItem}
          label={cellData.label}
          error={Boolean(cellData.error && cellData.touched)}
          inputProps={{
            ...(cellData.type === 'number' && { min: 0 }),
            ...(cellData.disabled && { readOnly: true, startAdornment: '₹' })
          }}
          // disabled={cellData.disabled}
          sx={{
            width: cellData?.dense ? 150 : 'max-content'
          }}
          helperText={cellData.touched && cellData.error}
        />
      )}
    </TableCell>
  );
}
