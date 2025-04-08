import { useMemo, useState, Fragment, MouseEvent } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { Skeleton } from '@mui/material';
import Chip from '@mui/material/Chip';

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
import AccountHeadModal from 'sections/masters/accountHead/AccountHeadModal';
import AlertAccountHeadDelete from 'sections/masters/accountHead/AlertAccountHeadDelete';
import { getUserModuleData, SubModuleEnum, UserModuleEnum, SubModuleButtonEnum } from 'utils/modules';
import { DebouncedInput, HeaderSort, RowSelection, TablePagination } from 'components/third-party/react-table';
import { useGetAccountHeadList } from 'api/masters';
// types
import { VendorList } from 'types/masters';
// assets
import { Add, Trash } from 'iconsax-react';
interface Props {
  columns: ColumnDef<VendorList>[];
  data: VendorList[];
  modalToggler: () => void;
  loading: boolean;
}
// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler, loading }: Props) {
  //const theme = useTheme();

  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const projectModule: any = useMemo(() => getUserModuleData(UserModuleEnum.Settings, SubModuleEnum.Settings.ManageAccountHead), []);
  const permission_add =
    projectModule?.sub_module_button?.find(
      (button: any) => button?.sub_module_button === SubModuleButtonEnum.Settings.ManageAccountHead.AddAccountHead
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
  //const backColor = alpha(theme.palette.primary.lighter, 0.1);

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
                {Array(4)
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
              Add Account Head
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
// ==============================|| VENDOR LIST ||============================== //

export default function AccountHeadListPage() {
  const theme = useTheme();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { AccountHeadLoading: loading, AccountHead: lists, refetch: getAccountHeadList } = useGetAccountHeadList();
  const [open, setOpen] = useState<boolean>(false);

  const [accountHeadModal, setAccountHeadModal] = useState<boolean>(false);
  const [selectedAccountHead, setSelectedAccountHead] = useState<VendorList | null>(null);
  const [accountHeadDeleteId, setAccountHeadDeleteId] = useState<any>('');

  const handleClose = () => {
    setOpen(!open);
  };
  const projectModule: any = useMemo(() => getUserModuleData(UserModuleEnum.Settings, SubModuleEnum.Settings.ManageAccountHead), []);
  const permission_delete =
    projectModule?.sub_module_button?.find(
      (button: any) => button?.sub_module_button === SubModuleButtonEnum.Settings.ManageAccountHead.DeleteAccountHead
    )?.access ?? false;
  const columns = useMemo<ColumnDef<VendorList>[]>(
    () => [
      {
        header: 'NAME',
        accessorKey: 'name',
        cell: (cell) => {
          if (cell.getValue() === '' || cell.getValue() === null) {
            return '-';
          }
          return cell.getValue();
        }
      },
      {
        header: 'ACCOUNT HEAD TYPE',
        accessorKey: 'account_head_type',
        cell: (cell) => {
          if (cell.getValue() === 'B') {
            return (
              <>
                <Chip color="primary" label="Credit" size="small" variant="light" />
                <Chip color="success" label="Debit" size="small" variant="light" />
              </>
            );
          } else if (cell.getValue() === 'C') {
            return (
              <>
                <Chip color="primary" label="Credit" size="small" variant="light" />
              </>
            );
          } else if (cell.getValue() === 'D') {
            return (
              <>
                <Chip color="success" label="Debit" size="small" variant="light" />
              </>
            );
          }
          return <Chip color="info" label="Interest" size="small" variant="light" />;
        }
      },
      {
        header: 'ACCOUNT HEAD CATEGORY',
        accessorKey: 'account_head_category',
        cell: (cell) => {
          if (cell.getValue() === 'LC') {
            return (
              <>
                <Chip label="Local Contribution" size="small" variant="outlined" />
              </>
            );
          }
          return <Chip label="Foreign Contribution" size="small" />;
        }
      },
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {permission_delete && (
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleClose();
                      setAccountHeadDeleteId(Number(row.original.id));
                    }}
                  >
                    <Trash />
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
            setAccountHeadModal(true);
            setSelectedAccountHead(null);
            // getCreditEmpList();
          },
          loading
        }}
      />
      <AlertAccountHeadDelete
        id={Number(accountHeadDeleteId)}
        title={accountHeadDeleteId}
        open={open}
        handleClose={handleClose}
        accountHeadRefetch={getAccountHeadList}
      />
      <AccountHeadModal
        open={accountHeadModal}
        modalToggler={setAccountHeadModal}
        accountHead={selectedAccountHead}
        accountHeadRefetch={getAccountHeadList}
      />
    </>
  );
}
