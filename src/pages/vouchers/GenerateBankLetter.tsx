/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import { useMemo, useState, Fragment, MouseEvent, useEffect } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
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
import InputLabel from '@mui/material/InputLabel';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Checkbox from '@mui/material/Checkbox';
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
// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';
import { Skeleton } from '@mui/material';
import { formateCurrency } from 'utils/currency';
import { HeaderSort, RowSelection } from 'components/third-party/react-table';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  useGetProjectList,
  useGetBankLetterFinancialYear,
  useGetBankLetterVoucherList,
  useGetBankLetterBankList,
  useGetBankDetails,
  useGeneratePdf
} from 'api/voucher';
import VoucherPdfPreview from 'sections/vouchers/VoucherPdfPreview';
import useDownlader from 'react-use-downloader';
// types
import { CreditvoucherList } from 'types/customer';
// assets
import { Add, Eye, Trash, TickCircle, AddCircle } from 'iconsax-react';
import Fab from '@mui/material/Fab';
import LoadingButton from 'components/@extended/LoadingButton';
import storage from 'utils/storage';
import { UserProfile } from 'types/auth';
interface Props {
  columns: ColumnDef<CreditvoucherList>[];
  data: CreditvoucherList[];
  modalToggler: () => void;
  loading: boolean;
}
interface InitialValues {
  voucherNo: number[];
  checkNo: string;
  bankName: string;
  letterNo: string;
  projectCode: number;
  letterDate: string;
  checkDate: string;
  financialYear: number;
  totalAmount: number;
}
const initialValues: InitialValues = {
  voucherNo: [],
  checkNo: '',
  bankName: '',
  letterNo: '',
  projectCode: 0,
  letterDate: dayjs().format('YYYY-MM-DD'),
  checkDate: dayjs().format('YYYY-MM-DD'),
  financialYear: 0,
  totalAmount: 0
};
const ProjectSchema = Yup.object().shape({
  voucherNo: Yup.array().of(Yup.number()).min(1, 'Voucher Number is required').required('Voucher Number is required'),
  checkNo: Yup.string().required('Check Number is required'),
  bankName: Yup.string().required('Bank Name is required'),
  letterNo: Yup.string().required('Letter Number is required'),
  projectCode: Yup.number().required('Project Code is required').notOneOf([0], 'Project Code is required'),
  letterDate: Yup.string().required('Letter Date is required'),
  checkDate: Yup.string().required('Check Date is required'),
  financialYear: Yup.number().required('Financial Year is required').notOneOf([0], 'Financial Year is required')
});

// // ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, loading }: Props) {
  const theme = useTheme();
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
          {Array(1)
            .fill(0)
            .map((item: number) => (
              <TableRow key={item}>
                {Array(6)
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
            <Table>
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
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}
// ==============================|| CREDIT VOUCHER LIST ||============================== //

export default function CrdeditVoucherListPage() {
  const { user_id, business_id }: UserProfile = storage.getItem('user');
  const theme = useTheme();
  const [pcode, setPcode] = useState<any>({ label: '--SELECT PROJECT--', value: 0 });
  const [bankDetails, setBankDetails] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedVoucherList, setSelectedVoucherList] = useState<any>([]);
  const [deletedVoucher, setDeletedVoucher] = useState<any>([]);
  const [basicDetails, setBasicDetails] = useState<any>([]);
  const [bankLetterPdf, setBankLetterPdf] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [voucherListLoading, setVoucherListLoading] = useState<boolean>(false);
  const [isNotProjectSelected, setIsNotProjectSelected] = useState<boolean>(true);
  const { download, isInProgress, percentage } = useDownlader();
  const handleClose = () => {
    setOpen(false);
  };
  const handleDownload = () => {
    // eslint-disable-next-line no-useless-concat
    download(bankLetterPdf, 'BANK-LETTER' + '.pdf');
  };
  useEffect(() => {
    const filteredData = bankDetails.filter((item: any) => item.voucher_id != deletedVoucher.voucher_id);
    setBankDetails(filteredData);
  }, [deletedVoucher]);

  useEffect(() => {
    const totalAmt = bankDetails.reduce((total: any, item: any) => total + item.amount, 0);
    setTotalAmount(totalAmt);
  }, [JSON.stringify(bankDetails)]);
  const { touched, values, errors, handleChange, setFieldValue, resetForm, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: ProjectSchema,
    onSubmit: (val) => {
      onSubmit(val);
    }
  });
  const handleClickOpen: any = () => {
    setOpen(true);
  };
  const onSubmit = async (val: any) => {
    const voucherList = val.voucherNo;
    setSelectedVoucherList(voucherList);
    setBasicDetails(val);
    const formatedValues = { voucher_list: voucherList, business_id: business_id };
    await getBankDetails(formatedValues as any);
  };
  const handleSubmitPdf = async () => {
    setVoucherListLoading(!voucherListLoading);
    onGeneratePdf(basicDetails);
  };
  // --------------------------------
  const onGeneratePdf = async (basicDetails: any) => {
    const formatedValues = {
      voucher_list: selectedVoucherList,
      business_id: business_id,
      cheque_date: basicDetails.checkDate,
      cheque_number: basicDetails.checkNo,
      letter_date: basicDetails.letterDate,
      reference_number: basicDetails.letterNo,
      account_number: basicDetails.bankName,
      total_amount: totalAmount,
      user_id: user_id,
      details: bankDetails
    };
    await getGeneratePdf(formatedValues);
  };

  const { getBankDetails, isLoading } = useGetBankDetails(
    (response: any) => {
      if (response?.result) {
        const details = response.data;
        const updatedArray = details.map((item: any, index: number) => ({
          ...item,
          ordinal: index + 1
        }));
        setBankDetails(updatedArray);
      }
    },
    () => {}
  );

  // ---------------- GENEATE PDF---------------------
  const { getGeneratePdf } = useGeneratePdf(
    (response: any) => {
      if (response?.result) {
        const base64Pdf = response.data.encrypt_file || '';
        const file = `data:application/pdf;base64,${base64Pdf}`;
        setBankLetterPdf(file);
        setVoucherListLoading(!voucherListLoading);
        handleClickOpen();

        openSnackbar({
          open: true,
          message: response.message,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          }
        } as SnackbarProps);
        // handleClose();
      }
    },
    (error: any) => {
      openSnackbar({
        open: true,
        message: error[0].msg || 'An error occurred while cancel voucher.',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'error'
        }
      } as SnackbarProps);
    }
  );
  // ---------------- ---------------------
  const handleResetfield = () => {
    resetForm();
    setFieldValue('voucherNo', []);
    setFieldValue('financialYear', 0);
    setFieldValue('bankName', '');
    setTotalAmount(0);
    setBankDetails([]);
  };
  var { financialYearData: projectFinancialYearData } = useGetBankLetterFinancialYear(pcode.value);
  var { voucherListData: projectVoucherList } = useGetBankLetterVoucherList(pcode.value, values.financialYear);
  var { bankListData: projectBankList } = useGetBankLetterBankList(pcode.value);
  var { projects } = useGetProjectList();
  projects = [{ label: '--SELECT PROJECT--', value: 0 }, ...projects];
  const columns = useMemo<ColumnDef<CreditvoucherList>[]>(
    () => [
      {
        header: 'Voucher No',
        accessorKey: 'voucher_number'
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: (cell: any) => {
          if (cell.getValue()) {
            const date = dayjs(cell.getValue());
            return date.format('DD-MM-YYYY');
          }
          return '';
        }
      },
      {
        header: 'Project Code',
        accessorKey: 'project_code'
      },
      {
        header: 'Payment To',
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
              <Add
                style={{
                  color: theme.palette.error.main,
                  transform: 'rotate(45deg)'
                }}
              />
            ) : (
              <Eye />
            );
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {/* ---------------CANCEL-------------- */}
              <Tooltip title="Cancel">
                <IconButton
                  color="error"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setDeletedVoucher(row.original);
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );
  return (
    <>
      <Grid container gap={1} sx={{ mb: '30px' }} direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={3.5}>
          <InputLabel sx={{ mb: 1 }}>{'Project Code'}</InputLabel>
          <Autocomplete
            //  value={pcode}
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
              handleResetfield();
              setFieldValue('projectCode', project?.value);
              setPcode({ label: project?.label, value: project?.value });
              setIsNotProjectSelected(false);
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
        {/* ----------------------------------- */}
        <Grid item xs={12} md={3.5}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <InputLabel sx={{ mb: 1 }}>{'Letter Date'}</InputLabel>
            <Stack>
              <MobileDatePicker
                format={'dd/MM/yyyy'}
                value={new Date(values.letterDate)}
                onChange={(date) => {
                  setFieldValue('letterDate', dayjs(date).format('YYYY-MM-DD'));
                }}
              />
            </Stack>
          </LocalizationProvider>
        </Grid>
        {/* ----------------------------------- */}
        {/* ----------------------------------- */}
        <Grid item xs={12} md={3.5}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <InputLabel sx={{ mb: 1 }}>{'Check Date'}</InputLabel>
            <Stack>
              <MobileDatePicker
                format={'dd/MM/yyyy'}
                value={new Date(values.letterDate)}
                onChange={(date) => {
                  setFieldValue('checkDate', dayjs(date).format('YYYY-MM-DD'));
                }}
              />
            </Stack>
          </LocalizationProvider>
        </Grid>
        {/* ----------------------------------- */}
        <Grid item xs={12} md={3.5}>
          <InputLabel sx={{ mb: 1 }}>{'Bank Name'}</InputLabel>
          <Autocomplete
            disabled={isNotProjectSelected}
            // value={pcode}
            // value={bank}
            key={values.bankName}
            sx={{
              '& .MuiInputBase-root': {
                height: '48px'
                // minWidth: '250px',
                // maxWidth: 'auto'
              },
              '& .MuiOutlinedInput-root': {
                padding: 0
              },
              '& .MuiAutocomplete-inputRoot': {
                padding: '0 14px'
              }
            }}
            onChange={(_e, project) => {
              setFieldValue('bankName', project?.value);
              // setBank({ label: project?.label, value: project?.value });
            }}
            multiple={false}
            // defaultValue={projects.find((p) => p.value === values.bankName)}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            style={{ width: '100%' }}
            id="bankName"
            options={projectBankList}
            renderInput={(params) => (
              <TextField
                error={touched.bankName && Boolean(errors.bankName)}
                helperText={touched.bankName && errors.bankName}
                name="bankName"
                placeholder="Bank Name"
                {...params}
              />
            )}
          />
        </Grid>
        {[
          {
            id: 2,
            label: 'Letter No /Ref No',
            field: 'letterNo',
            type: 'text'
          }
        ].map((field: any) => {
          return (
            <Grid item xs={12} md={3.5}>
              <InputLabel sx={{ mb: 1 }}>{field.label}</InputLabel>
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
        {[
          {
            id: 2,
            label: 'Check No',
            field: 'checkNo',
            type: 'text'
          }
        ].map((field: any) => {
          return (
            <Grid item xs={12} md={3.5}>
              <InputLabel sx={{ mb: 1 }}>{field.label}</InputLabel>
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
        <Grid item xs={12} md={2}>
          <Autocomplete
            //value={fyear}
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
              // setFyear(project?.value);
              // setFyear({ label: project?.label, value: project?.value });
            }}
            disabled={isNotProjectSelected}
            multiple={false}
            // defaultValue={financialYearData.find((p) => p.value == values.financialYear)}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            id="financialYear"
            options={projectFinancialYearData}
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
        {/* ------------------ */}

        <Grid item xs={12} md={5.1}>
          <Autocomplete
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
            multiple
            disabled={isNotProjectSelected}
            id="checkboxes-tags-demo"
            options={projectVoucherList}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onChange={(_e, project) => {
              setFieldValue(
                'voucherNo',
                project.map((p) => p.value)
              );
            }}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {option.label}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                error={touched.voucherNo && Boolean(errors.voucherNo)}
                helperText={touched.voucherNo && errors.voucherNo}
                name="voucherNo"
                placeholder="Voucher No"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={0.8}>
          <IconButton variant="shadow" color="primary" onClick={() => handleSubmit()}>
            <AddCircle />
          </IconButton>
        </Grid>
        {[
          {
            id: 2,
            label: 'Total Amount',
            field: 'totalAmount',
            type: 'text'
          }
        ].map((field: any) => {
          return (
            <Grid item xs={12} md={2}>
              <TextField
                type={field.type}
                id={field.field}
                name={field.field}
                value={formateCurrency(totalAmount)}
                fullWidth
                InputProps={{
                  readOnly: true,
                  startAdornment: 'Total:'
                }}
              />
            </Grid>
          );
        })}
      </Grid>

      {
        <ReactTable
          {...{
            data: bankDetails,
            columns,
            modalToggler: () => {},
            loading: isLoading
          }}
        />
      }
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} sm={3.5}></Grid>
        <Grid item xs={12} sm={3}></Grid>
        <Grid item xs={12} sm={2.5} sx={{ mt: 5 }}>
          <LoadingButton
            loading={voucherListLoading}
            color="success"
            variant="contained"
            loadingPosition="end"
            endIcon={<TickCircle variant="Bold" />}
            onClick={() => handleSubmitPdf()}
          >
            Generate Bank Letter
          </LoadingButton>
        </Grid>
      </Grid>
      <VoucherPdfPreview
        open={open}
        handleClose={handleClose}
        pdfUrl={bankLetterPdf}
        handleDownload={handleDownload}
        isInProgress={isInProgress}
        percentage={percentage}
      />
    </>
  );
}
