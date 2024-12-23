import { Fragment, useMemo } from 'react';

// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// third-party
import { flexRender, useReactTable, ColumnDef, HeaderGroup, getExpandedRowModel, getCoreRowModel } from '@tanstack/react-table';

// project import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
// types
import { LabelKeyObject } from 'react-csv/lib/core';

// assets
import { Chip, Pagination, Stack } from '@mui/material';
import { Skeleton } from '@mui/material';
import { Divider } from '@mui/material';
import { formateCurrency } from 'utils/currency';
import { VoucherDetail } from 'types/vouchers';
import { useViewInternalLoanContext } from 'pages/vouchers/view-internal-loan/view-internal-loan-context';

interface ReactTableProps {
  columns: ColumnDef<VoucherDetail>[];
  data: VoucherDetail[];
  loading: boolean;
}

function ReactTable({ columns, data, loading }: ReactTableProps) {
  const table = useReactTable({
    data,
    columns,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  });

  let headers: LabelKeyObject[] = [];
  table.getAllColumns().map(
    (columns) =>
      // @ts-ignore
      columns.columnDef.accessorKey &&
      headers.push({
        label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
        // @ts-ignore
        key: columns.columnDef.accessorKey
      })
  );

  if (loading) {
    return (
      <Table size="small">
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
              {[0, 1, 2, 3, 4, 5].map((col: number) => (
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
    <MainCard sx={{ m: 0, p: 1 }} content={false} border={false}>
      <ScrollX>
        <TableContainer>
          <Table size="small">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel()?.rows.map((row) => (
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
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack sx={{ p: 2 }} alignItems={'flex-end'}>
            {/* <TablePagination
              {...{
                setPageSize: table.setPageSize,
                setPageIndex: table.setPageIndex,
                getState: table.getState,
                getPageCount: table.getPageCount
              }}
            /> */}
            <Pagination
              count={table.getPageCount()}
              page={table.getState().pagination.pageIndex}
              onChange={(e, page) => table.setPageIndex(page)}
              defaultPage={2}
              variant="contained"
              color="primary"
            />
          </Stack>
        </>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| REACT TABLE - EXPANDING SUB TABLE ||============================== //

export default function DetailTable() {
  const loading = false;
  const { loanDetail } = useViewInternalLoanContext()!;
  const columns = useMemo<ColumnDef<VoucherDetail>[]>(
    () => [
      {
        header: '#',
        accessorKey: 'ordinal'
      },
      {
        header: 'Voucher No',
        accessorKey: 'number'
      },
      {
        header: 'Date',
        accessorKey: 'date'
      },
      {
        header: 'Ref Number',
        accessorKey: 'ref_number'
      },
      {
        header: 'Loan Amount',
        accessorKey: 'amount',
        cell: (cell: any) => {
          const voucherType = cell?.row?.original.voucher_type;
          if (voucherType === 'Credit') {
            return <Chip size={'small'} color="success" variant="combined" label={formateCurrency(Number(cell?.getValue() ?? 0))}></Chip>;
          } else {
            return formateCurrency(Number(cell?.getValue() ?? 0));
          }
        }
      },
      {
        header: 'Settle Amount',
        accessorKey: 'amount',
        cell: (cell: any) => {
          const voucherType = cell?.row?.original?.voucher_type;
          if (voucherType === 'Debit') {
            return <Chip size={'small'} color="warning" variant="combined" label={formateCurrency(Number(cell?.getValue() ?? 0))}></Chip>;
          } else {
            return formateCurrency(Number(cell?.getValue() ?? 0));
          }
        }
      },
      {
        header: () => <div style={{ marginLeft: '10px' }}>Status</div>,
        accessorKey: 'status_id',
        cell: (cell) => {
          return (
            <div style={{ textAlign: 'left' }}>
              {(() => {
                switch (cell.getValue()) {
                  case 1:
                    return <Chip color="info" label="Open" size="small" variant="light" />;
                  case 2:
                    return <Chip color="success" label="Confirmed" size="small" variant="light" />;
                  case 3:
                    return <Chip color="error" label="Cancelled" size="small" variant="light" />;
                  case 4:
                    return <Chip color="primary" label="Approved" size="small" variant="light" />;
                }
              })()}
            </div>
          );
        }
      }
    ],
    []
  );

  return <ReactTable {...{ columns, data: (loanDetail?.voucher_details as VoucherDetail[]) || [], loading }} />;
}
