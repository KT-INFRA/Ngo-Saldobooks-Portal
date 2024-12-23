import React, { useMemo, Fragment } from 'react';

// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Chip, Pagination, Stack, Skeleton, Divider, Tooltip, IconButton} from '@mui/material';
import { useTheme } from '@mui/material/styles';



// third-party
import {
  flexRender,
  useReactTable,
  ColumnDef,
  HeaderGroup,
  getExpandedRowModel,
  getCoreRowModel,
} from '@tanstack/react-table';

// project import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import { formateCurrency } from 'utils/currency';



// date handling
import dayjs from 'dayjs';

// custom hook for fetching data
import { useGetProjectInternalLoan } from 'api/project';
import { useGetProjectDetailsContext } from 'pages/projects/utils';
import { ProjectInternalLoan } from 'types/project';
import { Add, AlignLeft, AlignRight, Eye, TextalignRight } from 'iconsax-react';
import Typography from '@mui/material/Typography'; // Correct
import  { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import LoanDashboard from './LoanDashbord';
import { textAlign } from '@mui/system';


// Props for the actionCell
interface Props {
  row:any;
}

// ActionCell 
export const ActionsCell = ({ row } : Props) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleView = () => {
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const collapseIcon =
    row.getCanExpand() && row.getIsExpanded() ? (
      <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
    ) : (
      <Eye />
    );

  return (
    <>
      {/* Actions */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
        <Tooltip title="View">
          <IconButton color="secondary" onClick={handleView}>
            {collapseIcon}
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Details</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            <strong>Voucher No:</strong> {row.original?.number || '-'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Narration:</strong> {row.original?.narration || '-'}
          </Typography>
          {/* Add more fields if needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};



// ReactTable Component
function ReactTable({
  columns,
  data,
  loading,
}: {
  columns: ColumnDef<ProjectInternalLoan>[];
  data: ProjectInternalLoan[];
  loading: boolean;
}) {
  const table = useReactTable({
    data,
    columns,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  if (loading) {
    return (
      <Table size="small">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  <Skeleton animation="wave" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              {[...Array(8)].map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton animation="wave" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <MainCard sx={{ m: 0, p: 1}} content={false} border={false}>
      <ScrollX>

      <LoanDashboard></LoanDashboard>

        <TableContainer>
          <Table size="small">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    // <TableCell key={header.id} sx={{minWidth: header.getSize()}}>
                    <TableCell key={header.id} {...header.column.columnDef.meta}>

                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
  
                    </TableCell>
                  ))}
                  
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack sx={{ p: 2 }} alignItems="flex-end">
          <Pagination
            count={table.getPageCount()}
            page={table.getState().pagination.pageIndex + 1}
            onChange={(e, page) => table.setPageIndex(page - 1)}
            variant="contained"
            color="primary"
          />
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

// Main Component
export default function ProjectInternalLoans() {

  const { projectId } = useGetProjectDetailsContext()!;
  const { loanData, isLoading } = useGetProjectInternalLoan(projectId);
  const theme = useTheme();


const columns = useMemo<ColumnDef<ProjectInternalLoan>[]>(() => [
  {
    header: 'Date',
    accessorKey: 'date',
    cell: (cell :any) => {
      const value = cell.getValue();
      return value ? dayjs(value).format('DD-MM-YYYY') : '-';
    },
  },
  {
    header: 'From ',
    accessorKey: 'from_project_code',
    cell: (cell) => cell.getValue() || '-',
  },
  {
    header: 'To ',
    accessorKey: 'to_project_code',
    cell: (cell) => cell.getValue() || '-',
  },
  {
    header: 'Credit',
    accessorKey: 'amount.credit', 
    meta: { className: 'cell-right' }, 
    cell: (cell) => formateCurrency(Number(cell.getValue())),
  },
  {
    header: 'Debit',
    accessorKey: 'amount.debit',
    meta: { className: 'cell-right' }, 
    cell: (cell) => formateCurrency(Number(cell.getValue())),
  },
  
  
  {
    header: 'Status',
    accessorKey: 'status_name',
    cell: (cell) => {
      const status = cell.getValue();
      if (status === 'Open') return <Chip color="info" label="Open" size="small" variant="light" />;
      if (status === 'Confirmed') return <Chip color="success" label="Confirmed" size="small" variant="light" />;
      if (status === 'Paid') return <Chip color="primary" label="Paid" size="small" variant="light" />;
      return <Chip color="error" label="Canceled" size="small" variant="light" />;
    },
  },
 {
    header: 'Actions',
    disableSortBy: true,
    cell: (props) => <ActionsCell {...props} />,
  }
], []);

  return <ReactTable columns={columns} data={loanData} loading={isLoading} />;
}

