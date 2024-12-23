/* eslint-disable eqeqeq */
import { useMemo, useState } from 'react';

// material-ui
//import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import LoadingButton from 'components/@extended/LoadingButton';

// third-party
import { ColumnDef } from '@tanstack/react-table';
// project-import
import { formateCurrency } from 'utils/currency';

import { useGetViewAdvance, useGetViewAdvanceDetails } from 'api/voucher';
// types
// assets
import { Bank, Eye } from 'iconsax-react';
import { ViewAdvanceList } from 'types/vouchers';
import ViewAdvanceTable from 'sections/vouchers/view-advance/ViewAdvanceTable';
import SettleAdvanceModal from 'sections/vouchers/view-advance/SettleAdvanceModal';
import useModal from 'hooks/useModal';
import { ViewAdvanceProvider } from './view-advance-context';
import ViewAdvanceDetails from 'sections/vouchers/view-advance/ViewAdvanceDetails';
import dayjs from 'dayjs';
import { Box } from '@mui/material';
import ViewAdvanceFilterForm from 'sections/vouchers/view-advance/ViewAdvanceFilterForm';
import { FormikProvider, useFormik } from 'formik';
import { initialValues } from './utils';

export default function ViewAdvanceLoan() {
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {}
  });
  const { viewAdvanceList, isLoading, meta, handleChangePage, getAdvanceLists } = useGetViewAdvance(formik.values);
  const { open: previewOpen, openModal: openPreviewModal, closeModal: closePreviewModal } = useModal();
  const { open: settleOpen, openModal: openSettleModal, closeModal: closeSettleModal } = useModal();
  const [selectedAdvance, setSelectedAdvance] = useState<ViewAdvanceList | null>(null);
  const { advanceDetail, isLoading: isDetailLoading, getAdvanceDetail } = useGetViewAdvanceDetails();
  const handleGetAdvanceList = () => {
    getAdvanceLists();
  };
  const columns = useMemo<ColumnDef<ViewAdvanceList>[]>(
    () => [
      {
        header: 'VOUCHER NO',
        accessorKey: 'number'
      },
      {
        header: 'DATE',
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
        header: 'PROJECT',
        accessorKey: 'project_code'
      },
      {
        header: 'PAYMENT TO',
        accessorKey: 'payment_to'
      },
      {
        header: 'AMOUNT',
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
        header: 'STATUS',
        accessorKey: 'display_status'
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
                  loading={selectedAdvance?.id === data?.id && isDetailLoading}
                  onClick={async () => {
                    setSelectedAdvance({ ...data });
                    await getAdvanceDetail(
                      {
                        voucher_id: data?.id
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
                {data?.settle_status == false ? (
                  <LoadingButton
                    variant="text"
                    shape="rounded"
                    color="primary"
                    onClick={async () => {
                      setSelectedAdvance({ ...data });
                      await getAdvanceDetail(
                        {
                          voucher_id: data?.id
                        },
                        {
                          onSuccess: () => {
                            openSettleModal();
                          }
                        }
                      );
                    }}
                  >
                    <Bank />
                  </LoadingButton>
                ) : (
                  <Box width={40} height={40} />
                )}
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    [getAdvanceDetail, isDetailLoading, openPreviewModal, openSettleModal, selectedAdvance?.id]
  );

  return (
    <ViewAdvanceProvider
      value={{
        columns: columns,
        data: viewAdvanceList,
        selectedAdvance: selectedAdvance,
        advanceDetail: advanceDetail,
        isLoading: isLoading,
        meta: meta,
        handleChangePage: handleChangePage,
        handleGetAdvanceList: handleGetAdvanceList
      }}
    >
      <FormikProvider value={formik}>
        <ViewAdvanceFilterForm />
      </FormikProvider>
      <ViewAdvanceTable />
      <ViewAdvanceDetails open={previewOpen} handleClose={closePreviewModal} />
      <SettleAdvanceModal open={settleOpen} handleClose={closeSettleModal} />
    </ViewAdvanceProvider>
  );
}
