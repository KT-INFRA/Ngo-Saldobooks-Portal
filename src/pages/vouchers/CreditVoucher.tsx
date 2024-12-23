/* eslint-disable eqeqeq */
import { useMemo, useState, Fragment, MouseEvent, useEffect, ChangeEvent } from 'react';

// material-ui
//import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import LoadingButton from 'components/@extended/LoadingButton';
import { Pagination } from '@mui/material';
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
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';
import { getUserModuleData, SubModuleButtonEnum, SubModuleEnum, UserModuleEnum } from 'utils/modules';
import { Skeleton } from '@mui/material';
import { initialValues } from './utils';
import { formateCurrency } from 'utils/currency';
import { HeaderSort, RowSelection } from 'components/third-party/react-table';
import { useFormik } from 'formik';
import VoucherModel from 'sections/vouchers/VoucherModel';
import AlertCreditVoucherDelete from 'sections/vouchers/AlertCreditVoucherDelete';
import { useGetProjectList, useGetCreditVoucherPdf, useGetCreditVouchers, useGetPaymentType, useGetFinancialYear } from 'api/voucher';
import useDownlader from 'react-use-downloader';
import { currentFinancialYear } from 'pages/vouchers/utils';
// types
import { CreditvoucherList } from 'types/customer';
// assets
import { Edit, Eye, Trash } from 'iconsax-react';
import VoucherPdfPreview from 'sections/vouchers/VoucherPdfPreview';
import storage from 'utils/storage';
import { UserProfile } from 'types/auth';
const { business_id }: UserProfile = storage.getItem('user');
interface Props {
  columns: ColumnDef<CreditvoucherList>[];
  data: CreditvoucherList[];
  modalToggler: () => void;
  loading: boolean;
}

// // ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, loading }: Props) {
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
                {Array(8)
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
        </Stack>
      </ScrollX>
    </MainCard>
  );
}
// ==============================|| CREDIT VOUCHER LIST ||============================== //

export default function CrdeditVoucherListPage() {
  const { paymentTypes } = useGetPaymentType();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(10);
  const [voucherModal, setVoucherModal] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
  };
  const [open, setOpen] = useState<boolean>(false);
  const [voucherDeleteId, setVoucherDeleteId] = useState<any>('');
  const [voucherDeleteDate, setVoucherDeleteDate] = useState<any>('');
  const [voucherDeleteNumber, setVoucherDeleteNumber] = useState<any>('');
  const [voucherPdf, setVoucherPdf] = useState<any>('');
  const [selectedVoucherId, setSelectedVoucherId] = useState<number>(0);
  const [selectedVoucherData, setSelectedVoucherData] = useState<any>({});
  const [selectedVoucherIdPdf, setSelectedVoucherIdPdf] = useState<number>(0);
  const { download, isInProgress, percentage } = useDownlader();
  const handleClose = () => {
    setOpen(false);
    setSelectedVoucherIdPdf(0);
  };
  const handleDownload = () => {
    download(voucherPdf, selectedVoucherIdPdf + '.pdf');
  };

  // --------------------------FORMIK VALUE-------------------------------------
  const { touched, values, errors, handleChange, setFieldValue, resetForm } = useFormik({
    initialValues: initialValues,
    onSubmit: () => {
      onSubmit();
    }
  });
  const onSubmit = () => {
    getCreditCreditVoucherList();
  };

  const {
    vouchers: lists = [],
    vouchersLoading: loading,
    refetch: getCreditCreditVoucherList,
    handleChangePage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleChangePageSize,
    meta
  } = useGetCreditVouchers({
    ...values,
    page,
    limit
  });
  // ------------ PERMISSION------------------
  const projectModule: any = useMemo(() => getUserModuleData(UserModuleEnum.Accounts, SubModuleEnum.Accounts.CreditVoucher), []); //moduleId,submoduleId
  const permission_view =
    projectModule?.sub_module_button?.find((button: any) => button?.sub_module_button === SubModuleButtonEnum.Accounts.CreditVoucher.View)
      ?.access ?? false;
  const permission_confirm =
    projectModule?.sub_module_button?.find(
      (button: any) => button?.sub_module_button === SubModuleButtonEnum.Accounts.CreditVoucher.Confirm
    )?.access ?? false;
  const permission_cancel =
    projectModule?.sub_module_button?.find((button: any) => button?.sub_module_button === SubModuleButtonEnum.Accounts.CreditVoucher.Cancel)
      ?.access ?? false;
  //-----------------------------
  var { projects } = useGetProjectList();
  projects = [{ label: 'SELECT PROJECT', value: 0 }, ...projects];
  // -----------------------------FINANCIAL YEAR--------------
  const { financialYearData = [] } = useGetFinancialYear();
  // -----------------------------PDF PRINT--------------------
  useEffect(() => {
    selectedVoucherIdPdf && handlePdfPrint(Number(selectedVoucherIdPdf));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoucherIdPdf]);
  const handlePdfPrint = async (selectedVoucherId: number) => {
    const formatedValues = { voucher_id: selectedVoucherId, b: business_id };
    await getCreditVoucherPdf(formatedValues as any);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const { getCreditVoucherPdf, isLoading } = useGetCreditVoucherPdf(
    (response: any) => {
      if (response?.result) {
        const token = response.data.file;
        const decoded: any = jwtDecode(token);
        const exactpath = decoded?.path;
        setVoucherPdf(exactpath);
        handleClickOpen();
      }
    },
    () => {}
  );
  // --------------------------------------------------------------
  const handleReset = () => {
    resetForm();
    setFieldValue('voucherNo', '');
    setFieldValue('projectCode', 0);
    setFieldValue('financialYear', currentFinancialYear);
  };
  // ----------------------------------------------------
  const columns = useMemo<ColumnDef<CreditvoucherList>[]>(
    () => [
      {
        header: 'Voucher No',
        accessorKey: 'number',
        cell: (cell) => {
          if (cell.getValue() === '' || cell.getValue() === null) {
            return '-';
          }
          return cell.getValue();
        }
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: (cell: any) => {
          if (cell.getValue()) {
            const date = dayjs(cell.getValue());
            return date.format('DD-MM-YYYY');
          }
          return '-';
        }
      },
      {
        header: 'Project Code',
        accessorKey: 'project_code',
        cell: (cell) => {
          if (cell.getValue() === '' || cell.getValue() === null) {
            return '-';
          }
          return cell.getValue();
        }
      },
      {
        header: 'Budget Head',
        accessorKey: 'account_head',
        cell: (cell) => {
          if (cell.getValue() === '' || cell.getValue() === null) {
            return '-';
          }
          return cell.getValue();
        }
      },
      {
        header: 'Funding Agency',
        accessorKey: 'funding_agencies',
        cell: (cell) => {
          if (cell.getValue() === '' || cell.getValue() === null) {
            return '-';
          }
          return cell.getValue();
        }
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
      },

      {
        header: 'Status',
        accessorKey: 'status_id',
        cell: (cell) => {
          switch (cell.getValue()) {
            case 1:
              return <Chip color="info" label="Open" size="small" variant="light" />;
            case 2:
              return <Chip color="success" label="Confirmed" size="small" variant="light" />;
            case 3:
            default:
              return <Chip color="error" label="Canceled" size="small" variant="light" />;
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
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {/* ---------------VIEW-------------- */}

              {permission_view && row.original.status_id != 5 ? (
                <Tooltip title="View">
                  <LoadingButton
                    color="primary"
                    variant="text"
                    shape="rounded"
                    loading={Boolean(row.original.id == selectedVoucherIdPdf && isLoading)}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setSelectedVoucherIdPdf(row.original.id);
                    }}
                  >
                    <Eye />
                  </LoadingButton>
                </Tooltip>
              ) : (
                <div />
              )}
              {/* ---------------CONFIRM-------------- */}
              {permission_confirm && row.original.status_id != 5 && row.original.status_id != 2 ? (
                <Tooltip title="Confirm">
                  <IconButton
                    color="primary"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setSelectedVoucherId(row.original.id);
                      setSelectedVoucherData({
                        receiver_type_id: row.original.receiver_type_id,
                        voucher_type_id: row.original.voucher_type_id,
                        voucher_category_id: row.original.voucher_category_id
                      });
                      setVoucherModal(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              ) : (
                <Box width={40} height={40} />
              )}
              {/* ---------------CANCEL-------------- */}
              {permission_cancel && row.original.status_id != 5 ? (
                <Tooltip title="Cancel">
                  <IconButton
                    color="error"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setVoucherDeleteId(row.original.id);
                      setVoucherDeleteDate(row.original.number);
                      setVoucherDeleteNumber(row.original.date);
                      handleAlertClose();
                    }}
                  >
                    <Trash />
                  </IconButton>
                </Tooltip>
              ) : (
                <Box width={40} height={40} />
              )}
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permission_view, selectedVoucherId, isLoading, permission_confirm, permission_cancel, handleAlertClose]
  );
  return (
    <>
      <Grid container gap={1} sx={{ mb: '30px' }}>
        <Grid item xs={12} sm={2.5}>
          <Autocomplete
            key={values.financialYear}
            sx={{
              '& .MuiInputBase-root': {
                height: '48px'
              },
              '& .MuiOutlinedInput-root': {
                padding: 0
              },
              '& .MuiAutocomplete-inputRoot': {
                padding: '0 14px'
              }
            }}
            onChange={(_e, project) => {
              setFieldValue('financialYear', project?.value);
            }}
            multiple={false}
            defaultValue={financialYearData.find((p) => p.value === values.financialYear)}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            id="financialYear"
            options={financialYearData}
            renderInput={(params) => (
              <TextField
                error={touched.financialYear && Boolean(errors.financialYear)}
                helperText={touched.financialYear && errors.financialYear}
                name="financialYear"
                placeholder="Financial Year"
                {...params}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2.5}>
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              displayEmpty
              id="demo-simple-select"
              value={values.status}
              placeholder="status"
              name="status"
              onChange={handleChange}
            >
              <MenuItem value={0}>ALL</MenuItem>
              <MenuItem value={1}>OPEN</MenuItem>
              <MenuItem value={2}>CONFIRMED</MenuItem>
              <MenuItem value={5}>CANCELLED</MenuItem>
              <MenuItem value={4}>BANK INTEREST</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2.5}>
          <Autocomplete
            key={values.projectCode}
            sx={{
              '& .MuiInputBase-root': {
                height: '48px'
              },
              '& .MuiOutlinedInput-root': {
                padding: 0
              },
              '& .MuiAutocomplete-inputRoot': {
                padding: '0 14px'
              }
            }}
            onChange={(_e, project) => {
              setFieldValue('projectCode', project?.value);
            }}
            multiple={false}
            defaultValue={projects.find((p) => p.value === values.projectCode)}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            style={{ width: '100%' }}
            id="projectCode"
            options={projects}
            renderInput={(params) => (
              <TextField
                error={touched.projectCode && Boolean(errors.projectCode)}
                helperText={touched.projectCode && errors.projectCode}
                name="projectCode"
                placeholder="Project Code"
                {...params}
              />
            )}
          />
        </Grid>

        {/* ------------------ */}
        <Grid item xs={12} sm={2.5}>
          {[
            {
              id: 2,
              label: 'Voucher Number',
              field: 'voucherNo',
              type: 'text'
            }
          ].map((field: any) => {
            return (
              <Grid item xs={12} md={12}>
                <TextField
                  type={field.type}
                  id={field.field}
                  name={field.field}
                  placeholder={`Enter ${field.label}`}
                  value={values[field.field as keyof typeof initialValues]}
                  onChange={handleChange}
                  //onBlur={handleBlur}
                  error={touched[field.field as keyof typeof initialValues] && Boolean(errors[field.field as keyof typeof initialValues])}
                  helperText={
                    touched[field.field as keyof typeof initialValues] && (errors[field.field as keyof typeof initialValues] as any)
                  }
                  fullWidth
                />
              </Grid>
            );
          })}
        </Grid>
        {/* -------------- */}
        <Grid item xs={12} sm={1}>
          <Button
            onClick={() => handleReset()}
            variant="text"
            color="error"
            fullWidth
            sx={{ height: '50px', width: 'max-content', px: 4 }}
            //variant="outlined"
          >
            {'Clear'}
          </Button>
        </Grid>
      </Grid>
      {
        <ReactTable
          {...{
            data: lists || [],
            columns,
            modalToggler: () => {
              // setSelectedVoucher(null);
            },
            loading
          }}
        />
      }
      <>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box sx={{ p: 2, alignItems: 'flex-end' }}>
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
      <VoucherPdfPreview
        open={open}
        handleClose={handleClose}
        pdfUrl={voucherPdf}
        handleDownload={handleDownload}
        isInProgress={isInProgress}
        percentage={percentage}
      />

      <VoucherModel
        formType="creditVoucher"
        open={voucherModal}
        modalToggler={setVoucherModal}
        voucher={selectedVoucherId}
        voucherData={selectedVoucherData}
        voucherUpdate={setSelectedVoucherId}
        paymentTypes={paymentTypes}
        submit={onSubmit}
      />
      <AlertCreditVoucherDelete
        id={voucherDeleteId}
        voucher_date={voucherDeleteDate}
        voucher_number={voucherDeleteNumber}
        //title={`Cancel Voucher - ${creditVoucherDeleteDate}`}
        open={openAlert}
        handleClose={handleAlertClose}
        submit={onSubmit}
      />
    </>
  );
}
