import { ChangeEvent, Fragment, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// third-party
import { flexRender, useReactTable, ColumnDef, HeaderGroup, getExpandedRowModel, getCoreRowModel } from '@tanstack/react-table';
import Badge from '@mui/material/Badge';


// project import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';

// types
import { LabelKeyObject } from 'react-csv/lib/core';

// assets
import { Add, Eye } from 'iconsax-react';
import { Box, Pagination, Stack, Tooltip } from '@mui/material';
import LedgerItem from './LedgerItem';
import { Skeleton } from '@mui/material';
import { Divider } from '@mui/material';
import Fade from '@mui/material/Fade';
import { ProjectLedgerList } from 'types/project';
import { useGetProjectLedgerContext } from './utils';
import { formateCurrency } from 'utils/currency';
import dayjs from 'dayjs';
// import TablePagination from './TablePagination';

export default function LedgerTable() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleChangePage, handleChangePageSize, isLoading, ledgers: data, meta } = useGetProjectLedgerContext()!;
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [uniqueVoucherDetails, setAccountHeadNames] = useState<{ account_head_name: string }[]>([]);
  const handleBadgeClick = (event: React.MouseEvent<HTMLElement>, voucherDetails: { account_head_name: string }[]) => {
    setAnchorEl(event.currentTarget);
    setAccountHeadNames(voucherDetails);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const columns = useMemo<ColumnDef<ProjectLedgerList>[]>(
    () => [
      {
        header: 'Voucher No',
        accessorKey: 'number'
      },
      {
        header: 'Voucher Date',
        accessorKey: 'date',
        cell: (cell :any) => {
          const value = cell.getValue();
          return value ? dayjs(value).format('DD-MM-YYYY') : '-';
        },
      },
      {
        header: 'Voucher Type',
        accessorKey: 'voucher_type',
        cell: (cell) => {
          switch (cell.getValue()) {
            case 'Debit':
              return <Chip color="primary" label="Debit" size="small" variant="outlined" />;
            case 'Credit':
              return <Chip color="warning" label="Credit" size="small" variant="light" />;
            default:
              return <Chip color="success" label="Debit" size="small" variant="light" />;
          }
        }
      },
      {
        header: 'Total Amount',
        accessorKey: 'total_amount',
        meta: { className: 'cell-right' }, 
        cell: (cell) => {
          const amt = Number(cell.getValue());
          return formateCurrency(amt, {decimal: true});
        }
      },
      {
        header: 'Account Head',
        accessorKey: 'voucher_details',
        cell: ({ getValue }) => {
          const voucherDetails = getValue() as { account_head_name: string }[];
          const uniqueVoucherDetails = Array.from(
            new Map(voucherDetails.map(item => [item.account_head_name, item])).values()
          );

          const moreAccountHeads = uniqueVoucherDetails.length > 1 ? uniqueVoucherDetails.length - 1 : 0;

          if (moreAccountHeads > 0) {
            return (
              <Tooltip title="Click to see More">
                <Badge
                  badgeContent={`${moreAccountHeads}+`}
                  color="primary"
                  variant="light"
                  onClick={(event: React.MouseEvent<HTMLElement>) => handleBadgeClick(event, uniqueVoucherDetails)}
                  sx={{ cursor: 'pointer' }}
                >
                  {uniqueVoucherDetails[0].account_head_name}
                </Badge>
              </Tooltip>
            );
          } else {
            return <>{uniqueVoucherDetails[0].account_head_name}</>;
          }
        }
      },

      {
        header: 'Status',
        accessorKey: 'status_id',
        cell: (cell) => {
          switch (cell.getValue()) {
            case 1:
              return <Chip color="error" label="Complicated" size="small" variant="light" />;
            case 2:
              return <Chip color="success" label="Relationship" size="small" variant="light" />;
            case 3:
            default:
              return <Chip color="success" label="Approved" size="small" variant="light" />;
          }
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
              <Tooltip title="View">
                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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

  if (isLoading) {
    return (
      <TableContainer>
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
            {[0, 1, 2, 4].map((item: number) => (
              <TableRow key={item}>
                {[0, 1, 2, 3, 4].map((col: number) => (
                  <TableCell key={col}>
                    <Skeleton animation="wave" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Box sx={{ p: 2 }}>
            {/* <TablePagination
              {...{
                setPageSize: (pageSize: any) => handleChangePageSize(pageSize),
                setPageIndex: (pageIndex: any) => {
                  alert(pageIndex);
                  handleChangePage(pageIndex + 1);
                },
                getPage: () => meta?.currentPage,
                getPageSize: () => meta.itemPerPage,
                getPageCount: () => meta.totalPages
              }}
            /> */}

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
      </TableContainer>
    );
  }

  return (
    <MainCard sx={{ m: 0, p: 1 }} content={false} border={false}>
      <ScrollX>
        <TableContainer>
          <Table size={'small'}>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id} sx={{ '& > th:first-of-type': { width: 150 } }}>
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
                  {row.getIsExpanded() && (
                    <TableRow sx={{ '&:hover': { bgcolor: `${'#FFFF'} !important` }, overflow: 'hidden' }}>
                      <TableCell colSpan={row.getVisibleCells().length} sx={{ p: 2.5, overflow: 'hidden' }}>
                        <LedgerItem vouchers={row.original.voucher_details} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Box sx={{ p: 2, alignItems: 'flex-end' }}>
            {/* <TablePagination
              {...{
                setPageSize: (pageSize: any) => handleChangePageSize(pageSize),
                setPageIndex: (pageIndex: any) => {
                  alert(pageIndex);
                  handleChangePage(pageIndex + 1);
                },
                getPage: () => meta?.currentPage,
                getPageSize: () => meta.itemPerPage,
                getPageCount: () => meta.totalPages
              }}
            /> */}
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
        <Menu
          id="fade-menu"
          MenuListProps={{ 'aria-labelledby': 'fade-button' }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {uniqueVoucherDetails.map((detail, index) => (
            <MenuItem key={index}>{detail.account_head_name}</MenuItem>
          ))}
        </Menu>
      </ScrollX>
    </MainCard>

  );
}
