import { useMemo } from 'react';

// material-ui
// import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
//import FormProjectAdd from './FormProjectAdd';
import FormCreditVoucherConfirm from './FormConfirmCreditVoucher';
import FormDebitVoucherConfirm from './FormConfirmDebitVoucher';
import FormJournalVoucherConfirm from './FormConfirmJournalVoucher';

import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
//import CircularWithPath from 'components/@extended/progress/CircularWithPath';
//import { useGetProject } from 'api/project';
interface Props {
  formType: string;
  open: boolean;
  modalToggler: (state: boolean) => void;
  voucher?: number;
  voucherData?: any;
  voucherUpdate: any;
  paymentTypes?: any;
  submit: any;
}

// ==============================|| PROJECT ADD / EDIT ||============================== //

export default function VoucherModel({ open, modalToggler, voucher, voucherData, voucherUpdate, paymentTypes, submit, formType }: Props) {
  //const { projectsLoading: loading } = useGetProject();
  //alert(project);
  const closeModal = () => modalToggler(false);
  const FormComponent = useMemo(() => {
    switch (formType) {
      case 'creditVoucher':
        return FormCreditVoucherConfirm;
      case 'debitVoucher':
        return FormDebitVoucherConfirm;
      default:
        return FormJournalVoucherConfirm;
    }
  }, [formType]);

  // Memoize the voucher confirmation form
  const voucherConfirmForm = useMemo(
    () => (
      <FormComponent
        voucher={voucher || null}
        voucherData={voucherData}
        closeModal={closeModal}
        voucherUpdate={voucherUpdate}
        paymentTypes={paymentTypes}
        submit={submit}
      />
    ), // eslint-disable-next-line react-hooks/exhaustive-deps
    [voucher, FormComponent]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-project-add-label"
          aria-describedby="modal-project-add-description"
          sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              {/* {loading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : ( */}
              {voucherConfirmForm}
              {/* )} */}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
