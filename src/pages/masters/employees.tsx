import { useMemo, useState, Fragment } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
// import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Skeleton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

// third-party
import {
  ColumnDef,
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
import IconButton from 'components/@extended/IconButton';

import EmployeeModal from 'sections/masters/employees/EmployeeModal';
import EmployeeView from 'sections/masters/employees/EmployeeView';
import { DebouncedInput, HeaderSort, RowSelection, TablePagination } from 'components/third-party/react-table';
import { getUserModuleData, SubModuleEnum, UserModuleEnum, SubModuleButtonEnum } from 'utils/modules';
import { useGetEmployeeList } from 'api/masters';
// types
import { EmployeeDataTypes } from 'types/masters';
// assets
import { Add, Eye } from 'iconsax-react';
interface Props {
  columns: ColumnDef<EmployeeDataTypes>[];
  data: EmployeeDataTypes[];
  modalToggler: () => void;
  loading: boolean;
}
// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler, loading }: Props) {
  const theme = useTheme();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const projectModule: any = useMemo(() => getUserModuleData(UserModuleEnum.Settings, SubModuleEnum.Settings.ManageEmployees), []);
  const permission_add =
    projectModule?.sub_module_button?.find(
      (button: any) => button?.sub_module_button === SubModuleButtonEnum.Settings.ManageEmployees.AddEmployee
    )?.access ?? false;

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
  const backColor = alpha(theme.palette.primary.lighter, 0.1);

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
          {Array(10)
            .fill(0)
            .map((item: number) => (
              <TableRow key={item}>
                {Array(5)
                  .fill(0)
                  .map((col: number) => (
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
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} records...`}
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          {permission_add && (
            <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
              Add Employee
            </Button>
          )}
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          <TableContainer>
            <Table size="small">
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
                    {row.getIsExpanded() && (
                      <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` }, overflow: 'hidden' }}>
                        <TableCell colSpan={row.getVisibleCells().length} sx={{ p: 2.5, overflow: 'hidden' }}>
                          <EmployeeView data={row.original} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
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
    </MainCard>
  );
}
// ==============================|| EMPLOYEE LIST ||============================== //

export default function EmployeeListPage() {
  const theme = useTheme();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { employeesLoading: loading, employees: lists, refetch: getCreditEmpList } = useGetEmployeeList();
  const [employeeModal, setEmployeeModal] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDataTypes | null>(null);
  const projectModule: any = useMemo(() => getUserModuleData(UserModuleEnum.Settings, SubModuleEnum.Settings.ManageEmployees), []);
  const permission_view =
    projectModule?.sub_module_button?.find(
      (button: any) => button?.sub_module_button === SubModuleButtonEnum.Settings.ManageEmployees.ViewEmployee
    )?.access ?? false;
  const columns = useMemo<ColumnDef<EmployeeDataTypes>[]>(
    () => [
      {
        header: 'EMPLOYEE ID',
        accessorKey: 'emp_id',
        cell: (cell) => {
          if (cell.getValue() === '' || cell.getValue() === null) {
            return '-';
          }
          return cell.getValue();
        }
      },
      {
        header: 'NAME',
        accessorKey: 'first_name',
        cell: ({ row }) => {
          const { first_name, prefix, last_name } = row.original;
          return `${prefix} ${first_name} ${last_name}`;
        }
      },
      {
        header: 'DESIGNATION',
        accessorKey: 'designation_name',
        cell: (cell) => {
          if (cell.getValue() === '' || cell.getValue() === null) {
            return '-';
          }
          return cell.getValue();
        }
      },
      {
        header: 'EMPLOYMENT TYPE',
        accessorKey: 'is_permanent_emp',
        cell: (cell) => {
          if (cell.getValue()) {
            return <Chip color="success" label="Permanent" size="small" variant="light" />;
          }
          return <Chip color="info" label="Temporary" size="small" variant="light" />;
        }
      },
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const collapseIcon =
            row.getCanExpand() && row.getIsExpanded() ? (
              <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
            ) : (
              <Eye />
            );
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {permission_view && (
                <Tooltip title="View">
                  <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                    {collapseIcon}
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line
    [theme]
  );

  return (
    <>
      <ReactTable
        {...{
          data: lists || [],
          columns,
          modalToggler: () => {
            setEmployeeModal(true);
            setSelectedEmployee(null);
          },
          loading
        }}
      />
      <EmployeeModal open={employeeModal} modalToggler={setEmployeeModal} employee={selectedEmployee} employeeRefetch={getCreditEmpList} />
    </>
  );
}
