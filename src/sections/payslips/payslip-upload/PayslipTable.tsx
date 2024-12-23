import { useMemo } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';

// third-party
import { useReactTable, getCoreRowModel, getPaginationRowModel, ColumnDef, HeaderGroup, flexRender } from '@tanstack/react-table';

// project-import
import ScrollX from 'components/ScrollX';
import { TablePagination } from 'components/third-party/react-table';

// types
import { TableDataProps } from 'types/table';
import { LabelKeyObject } from 'react-csv/lib/core';
import { Tooltip } from '@mui/material';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ data, columns, top }: { data: TableDataProps[]; columns: ColumnDef<TableDataProps>[]; top?: boolean }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true
  });

  let headers: LabelKeyObject[] = [];
  table.getAllColumns().map((columns) =>
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
      // @ts-ignore
      key: columns.columnDef.accessorKey
    })
  );

  return (
    <ScrollX>
      <Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      {...header.column.columnDef.meta}
                      style={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Tooltip title={header.column.id} placement="top">
                        <div>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</div>
                      </Tooltip>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel()?.rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      {...cell.column.columnDef.meta}
                      style={{
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <>
          <Divider />
          <Box sx={{ p: 2 }}> 
            <TablePagination
              {...{
                setPageSize: table.setPageSize,
                setPageIndex: table.setPageIndex,
                getState: table.getState,
                getPageCount: table.getPageCount
              }}
            />
          </Box>
        </>
      </Stack>
    </ScrollX>
  );
}

// ==============================|| REACT TABLE - PAGINATION ||============================== //

export default function PayslipTable({ paySlipsData }: any) {
  const data = [...paySlipsData].map((_, i) => ({ SlNo: i + 1, ..._ }));

  const columns = useMemo<ColumnDef<TableDataProps>[]>(
    () => [
      { header: 'SNO', accessorKey: 'SlNo' },
      { header: 'Name', accessorKey: 'Name' },
      { header: 'Des', accessorKey: 'Designation' },
      { header: 'Emp Id', accessorKey: 'Employee Id' },
      { header: 'Pay', accessorKey: 'Pay' },
      { header: 'D A', accessorKey: 'Dearness Allowance' },
      { header: 'GPF/CPF', accessorKey: 'GPF/CPF Contribution' },
      { header: 'GSLIS', accessorKey: 'GSLIS' },
      { header: 'GAP', accessorKey: 'Gross amount Payable' },
      { header: 'HRAllowance', accessorKey: 'House Rent Allowance' },
      { header: 'ICFRE PF(Deduction)', accessorKey: 'ICFRE Pension Fund (Deduction)' },
      { header: 'ICFRE PF(Payment)', accessorKey: 'ICFRE Pension Fund (Payment)' },
      { header: 'IT', accessorKey: 'Income Tax' },
      { header: 'LF', accessorKey: 'Licence Fee' },
      { header: 'NP', accessorKey: 'Net Payable' },
      { header: 'TD', accessorKey: 'Total Deductions' },
      { header: 'TA', accessorKey: 'Transport Allowance' },
      { header: 'WC', accessorKey: 'Water Charges' }
      //   {
      //     header: 'Status',
      //     accessorKey: 'status',
      //     cell: (cell) => {
      //       switch (cell.getValue()) {
      //         case 'Complicated':
      //           return <Chip color="error" label="Complicated" size="small" variant="light" />;
      //         case 'Relationship':
      //           return <Chip color="success" label="Relationship" size="small" variant="light" />;
      //         case 'Single':
      //         default:
      //           return <Chip color="info" label="Single" size="small" variant="light" />;
      //       }
      //     }
      //   },
    ],
    []
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ReactTable {...{ data, columns }} />
      </Grid>
    </Grid>
  );
}
