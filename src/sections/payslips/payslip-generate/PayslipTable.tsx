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
import { LabelKeyObject } from 'react-csv/lib/core';
import { Chip, Skeleton, Tooltip } from '@mui/material';
import { GeneratePayBillResponse, Paycategory } from 'types/payroll';
import { formateCurrency } from 'utils/currency';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ data, columns, top, loading }: { data: Paycategory[]; columns: ColumnDef<any>[]; top?: boolean; loading: boolean }) {
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

  if (loading) {
    return (
      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id} {...header.column.columnDef.meta}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {[0, 1, 2, 4, 5, 6].map((item: number) => (
            <TableRow key={item}>
              {[0, 1, 2, 3, 4, 5, 6].map((col: number) => (
                <TableCell key={col}>
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
                      <Tooltip title={header.column.columnDef.header as any} placement="top">
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

export default function PayslipTable({ paySlipsData, loading }: any) {
  const data = [...paySlipsData].map((_, i) => ({ SlNo: i + 1, ..._ }));

  const columns = useMemo<ColumnDef<GeneratePayBillResponse['pay_category']>[]>(
    () => [
      { header: 'Emp ID', accessorKey: 'emp_id' },
      { header: 'First Name', accessorKey: 'first_name' },
      { header: 'Pan Number', accessorKey: 'pan_number' },
      { header: 'Gpf Number', accessorKey: 'gpf_number' },
      { header: 'Aadhar Number', accessorKey: 'aadhar_number' },
      // {
      //   header: 'Amount',
      //   accessorKey: '',
      //   cell: (cell) => {
      //     const payslip: Paycategory = data[cell.row.index];
      //     const amount = payslip?.payslip_details.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
      //     return formateCurrency(Number(amount || 0).toFixed(4));
      //   }
      // },
      {
        header: 'Amount',
        cell: (cell) => {
          const payslip: Paycategory = data[cell.row.index];
          const amountDetail = payslip?.payslip_details.find(
            (detail) => detail.pay_category_id === 1
          );
      
          if (amountDetail) {
            const amount = parseFloat(amountDetail.amount);
            // Use the updated formateCurrency with removeDecimals set to true
            return formateCurrency(amount);
          }
      
          return formateCurrency(0);
        }
      },
      
      
      {
        header: 'Generated',
        accessorKey: 'is_generated',
        cell: (cell) => {
          const value = cell.getValue();
          if (value === true) {
            return <Chip color="success" label="Yes" size="small" variant="light" />;
          } else {
            return <Chip color="warning" label="No" size="small" variant="light" />;
          }
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(data)]
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ReactTable {...{ data, columns }} loading={loading} />
      </Grid>
    </Grid>
  );
}
