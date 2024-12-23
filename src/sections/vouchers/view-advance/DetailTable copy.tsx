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
import { Skeleton } from '@mui/material';
import { formateCurrency } from 'utils/currency';
import { AdvanceDetailList } from 'types/vouchers';
import { useViewAdvanceContext } from '../../../pages/vouchers/view-advance/view-advance-context';

interface ReactTableProps {
  columns: ColumnDef<AdvanceDetailList>[];
  data: AdvanceDetailList[];
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
              {table.getRowModel()?.rows?.map((row) => (
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
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| REACT TABLE - EXPANDING SUB TABLE ||============================== //

/*************  ✨ Codeium Command ⭐  *************/
/******  6bc046b1-3de8-4746-8eaf-f8527d5fcfb9  *******/ export default function DetailTable() {
  const loading = false;
  const { advanceDetail } = useViewAdvanceContext()!;
  const columns = useMemo<ColumnDef<AdvanceDetailList>[]>(
    () => [
      {
        header: 'Account Head',
        accessorKey: 'account_head_name'
      },
      {
        header: 'Employee Name',
        accessorKey: 'beneficiary_name'
      },
      {
        header: 'Amount',
        accessorKey: 'amount',
        meta: {
          className: 'cell-right'
        },
        cell: (cell) => {
          const amt = Number(cell.getValue());
          return formateCurrency(amt);
        }
      }
    ],
    []
  );

  return <ReactTable {...{ columns, data: (advanceDetail?.advance_details as AdvanceDetailList[])! || [], loading }} />;
}
