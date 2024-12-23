import { Fragment, useMemo } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
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
import { Box } from '@mui/material';
import { Skeleton } from '@mui/material';
import { Divider } from '@mui/material';
import { TablePagination } from 'components/third-party/react-table';
import { IProjectBudgetItem } from './utils';
import { formateCurrency } from 'utils/currency';

// ==============================|| RENDER - SUB TABLE ||============================== //

interface ReactTableProps {
  columns: ColumnDef<IProjectBudgetItem>[];
  data: IProjectBudgetItem[];
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
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| REACT TABLE - EXPANDING SUB TABLE ||============================== //

export default function BudgetTable({
  budgets,
  loading,
  financialYears
}: {
  budgets: IProjectBudgetItem[];
  loading: boolean;
  financialYears: any;
}) {
  const financialYearsColumns = useMemo(
    () =>
      financialYears.map((fYear: { label: string; value: string }) => ({
        header: `${fYear.label}`,
        accessorKey: `${fYear.label}`,
        cell: (cell: any) => {
          return formateCurrency(Number(cell?.getValue() ?? 0));
        }
      })),
    [financialYears]
  );
  const columns = useMemo<ColumnDef<IProjectBudgetItem>[]>(
    () => [
      {
        header: 'Account Head',
        accessorKey: 'account_head'
      },
      ...financialYearsColumns,
      {
        header: 'Total',
        accessorKey: 'total_amount',
        cell: (cell: any) => {
          const original = cell.row.original;
          return original?.totalRow ? (
            <Chip color="primary" label={formateCurrency(Number(cell?.getValue() ?? 0))} size="small" variant="combined" />
          ) : (
            formateCurrency(Number(cell?.getValue() ?? 0))
          );
        }
      }
    ],
    [financialYearsColumns]
  );

  return <ReactTable {...{ columns, data: budgets, loading }} />;
}
