/* eslint-disable eqeqeq */
import { useMemo, useState } from 'react';

// material-ui
//import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import LoadingButton from 'components/@extended/LoadingButton';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// third-party
import { ColumnDef } from '@tanstack/react-table';
// project-import
import { formateCurrency } from 'utils/currency';

import { useGetInternalLoan, useGetInternalLoanDetails } from 'api/voucher';
// types
// assets
import { Bank, Eye } from 'iconsax-react';
import { InternalLoanList } from 'types/vouchers';
import ViewInternalVoucherTable from 'sections/vouchers/view-internal-loan/ViewInternalVoucherTable';
import SettleInternalLoanModal from 'sections/vouchers/view-internal-loan/SettleInternalLoanModal';
import useModal from 'hooks/useModal';
// import { ViewInternalLoanProvider } from './view-internal-loan-context';
import { ViewInternalLoanProvider } from 'pages/vouchers/view-internal-loan/view-internal-loan-context';
import ViewLoanVoucherDetails from 'sections/vouchers/view-internal-loan/ViewLoanVoucherDetails';
import MenuItem from '@mui/material/MenuItem';
import { useFormik } from 'formik';
import { Autocomplete, Grid, InputLabel, TextField, Button, CardActions } from '@mui/material';
import { useGetProjectList } from 'api/voucher';



export default function ViewInternalLoan() {
  // const { internalLoans, isLoading, meta, handleChangePage, refetch: getinternalloan } = useGetInternalLoan(values.projectCode);
  const { open: previewOpen, openModal: openPreviewModal, closeModal: closePreviewModal } = useModal();
  const { open: settleOpen, openModal: openSettleModal, closeModal: closeSettleModal } = useModal();
  const [selectedLoan, setSelectedLoan] = useState<InternalLoanList | null>(null);
  const { loanDetail, isLoading: isDetailLoading, getLoanDetail } = useGetInternalLoanDetails();
  const { touched, values, errors, handleChange, setFieldValue, resetForm, handleSubmit } = useFormik({
    initialValues: { projectCode: 0 },
    onSubmit: () => {
      // alert(values.projectCode);
      onSubmit();
    }
  });

  const onSubmit = () => {
    getinternalloan();
    // getCreditCreditVoucherList();
  };
  var { projects } = useGetProjectList();
  const { internalLoans, isLoading, meta, handleChangePage, refetch: getinternalloan } = useGetInternalLoan(values.projectCode);
  projects = [{ label: 'All', value: 0 }, ...projects];
  const columns = useMemo<ColumnDef<InternalLoanList>[]>(
    () => [
      {
        header: 'From',
        accessorKey: 'from_project_code'
      },
      {
        header: 'To',
        accessorKey: 'project_code'
      },
      {
        header: 'Letter/Ref No.To',
        accessorKey: 'letter_ref_no'
      },
      {
        header: 'Loan Amount',
        accessorKey: 'loan_amount',
        cell: (cell: any) => {
          return formateCurrency(Number(cell?.getValue() ?? 0));
        }
      },
      {
        header: 'Settle Amount',
        accessorKey: 'paid_amount',
        cell: (cell: any) => formateCurrency(Number(cell?.getValue() ?? 0))
      },

      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: (cell) => {
          const data = cell.row.original;
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <LoadingButton
                  color="primary"
                  variant="text"
                  shape="rounded"
                  loading={selectedLoan?.id === data?.id && isDetailLoading}
                  onClick={async () => {
                    setSelectedLoan({ ...data });
                    await getLoanDetail(
                      {
                        from_project_id: data?.from_project_id,
                        project_id: data?.project_id,
                        // status_id: data?.status_id
                      },
                      {
                        onSuccess: () => {
                          openPreviewModal();
                        }
                      }
                    );
                  }}
                >
                  <Eye />
                </LoadingButton>
              </Tooltip>
              <Tooltip title="Settle Amount">
                <LoadingButton
                  variant="text"
                  shape="rounded"
                  color="primary"
                  onClick={async () => {
                    setSelectedLoan(data);
                    openSettleModal();
                  }}
                >
                  <Bank />
                </LoadingButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    [getLoanDetail, isDetailLoading, openPreviewModal, openSettleModal, selectedLoan?.id]
  );

  return (
    <>
      {/* <h1>naveen</h1> */}
      {/* <FormControl fullWidth>
        <Select
          labelId="filter"
          displayEmpty
          id="filter"
          value={values.filter}
          placeholder="status"
          name="filter"
          onChange={handleChange}
        >
          <MenuItem value={0}>ALL</MenuItem>
          <MenuItem value={1}>OPEN</MenuItem>
          <MenuItem value={2}>CONFIRMED</MenuItem>
          <MenuItem value={5}>CANCELLED</MenuItem>
          <MenuItem value={4}>BANK INTEREST</MenuItem>
        </Select>
      </FormControl> */}
      <Grid container gap={1} sx={{ mb: '30px' }}>
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
              handleSubmit();
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
      </Grid>
      {/* <button onClick={handleSubmit}>click</button> */}
      {/* <Button onClick={() => handleSubmit()} variant="contained" color="primary">
        Click
      </Button> */}
      <ViewInternalLoanProvider
        value={{
          columns: columns,
          data: internalLoans,
          selectedLoan: selectedLoan,
          loanDetail: loanDetail,
          isLoading: isLoading,
          meta: meta,
          handleChangePage: handleChangePage
        }}
      >
        <ViewInternalVoucherTable />

        <ViewLoanVoucherDetails open={previewOpen} handleClose={closePreviewModal} />
        <SettleInternalLoanModal open={settleOpen} handleClose={closeSettleModal} />
      </ViewInternalLoanProvider>
    </>
  );
}
