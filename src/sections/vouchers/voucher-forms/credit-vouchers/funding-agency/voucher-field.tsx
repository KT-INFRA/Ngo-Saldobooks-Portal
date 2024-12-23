// material-ui
import { Autocomplete } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';

// ==============================|| VOUCHER - TEXT FIELD ||============================== //

export default function VoucherField({ onEditItem, cellData, accountHeads, handleChangeAccountHead }: any) {
  return (
    <TableCell
    // sx={{ '& .MuiFormHelperText-root': { position: 'absolute', bottom: -20, ml: 0 } }}
    >
      {cellData?.type === 'select' ? (
        <>
          <Autocomplete
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
            onChange={(e, project) => {
              handleChangeAccountHead(cellData.name, project?.value ?? '');
            }}
            defaultValue={accountHeads.find((accountHead: any) => accountHead.value === cellData.value) ?? null}
            style={{ width: '100%' }}
            id="account_head_id"
            options={accountHeads}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select AccountHead"
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
            ...(cellData.type === 'number' && { min: 0 })
          }}
          helperText={cellData.touched && cellData.error}
        />
      )}
    </TableCell>
  );
}
