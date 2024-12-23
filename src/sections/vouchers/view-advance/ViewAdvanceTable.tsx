/* eslint-disable eqeqeq */
import { useState, Fragment, ChangeEvent } from 'react';

// material-ui
//import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';

// third-party
import {
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table';
import { LabelKeyObject } from 'react-csv/lib/core';
// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Pagination, Skeleton } from '@mui/material';
import { HeaderSort, RowSelection } from 'components/third-party/react-table';
import { useViewAdvanceContext } from 'pages/vouchers/view-advance/view-advance-context';

interface ViewAdvanceVoucherTableProps {}

// eslint-disable-next-line no-empty-pattern
export default function ViewAdvanceTable({}: ViewAdvanceVoucherTableProps) {
  const { columns, data, isLoading: loading, meta, handleChangePage } = useViewAdvanceContext()!;
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true
  });

  let headers: LabelKeyObject[] = [];
  columns.map(
    (columns) =>
      // @ts-ignore
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        // @ts-ignore
        key: columns.accessorKey
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
          {Array(10)
            .fill(0)
            .map((item: number) => (
              <TableRow key={item}>
                {Array.from({ length: 7 }, (col: number, index: number) => (
                  <TableCell key={index + 1}>
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
    <MainCard content={false}>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection)?.length} />
          <Table size="small" sx={{ borderRadius: 0 }}>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                      Object.assign(header.column.columnDef.meta, {
                        className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                      });
                    }

                    return (
                      <TableCell
                        key={header.id}
                        {...header.column.columnDef.meta}
                        onClick={header.column.getToggleSortingHandler()}
                        {...(header.column.getCanSort() &&
                          header.column.columnDef.meta === undefined && {
                            className: 'cursor-pointer prevent-select'
                          })}
                      >
                        {header.isPlaceholder ? null : (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                            {header.column.getCanSort() && <HeaderSort column={header.column} />}
                          </Stack>
                        )}
                      </TableCell>
                    );
                  })}
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

          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
                <Pagination
                  sx={{ '& .MuiPaginationItem-root': { my: 0.5 } }}
                  count={meta.totalPages ?? 0}
                  size="medium"
                  page={meta.currentPage ?? 0}
                  showFirstButton
                  showLastButton
                  variant="combined"
                  color="primary"
                  onChange={(e: ChangeEvent<unknown>, page: number) => handleChangePage(page)}
                />
              </Stack>
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}
