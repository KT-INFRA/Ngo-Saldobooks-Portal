// material-ui
import React from 'react';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
// assets
import { formateCurrency } from 'utils/currency';
import { VoucherDetailsItem } from 'types/table';
import TablePagination from '@mui/material/TablePagination';
import { TableFooter } from '@mui/material';
export default function LedgerItem({ vouchers }: { vouchers: VoucherDetailsItem[] }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ borderRadius: 0 }}>
              <TableCell sx={{ position: 'sticky !important', backgroundColor: 'grey.200' }}>#</TableCell>
              <TableCell sx={{ position: 'sticky !important', backgroundColor: 'grey.200' }}>Account Head</TableCell>
              <TableCell sx={{ position: 'sticky !important', backgroundColor: 'grey.200' }}>Purpose</TableCell>
              <TableCell sx={{ position: 'sticky !important', backgroundColor: 'grey.200' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: VoucherDetailsItem, index: number) => (
              <TableRow hover={false} key={index}>
                <TableCell sx={{ pl: 3 }}>{item?.ordinal}</TableCell>
                <TableCell>{item?.account_head_name}</TableCell>
                <TableCell>{item?.purpose}</TableCell>
                <TableCell sx={{ pr: 3 }}>{formateCurrency(item?.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                count={vouchers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
