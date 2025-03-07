import { useMemo } from 'react';
import Modal from '@mui/material/Modal';

// project imports
import FormOwnBankAccountAdd from './FormOwnBankAccountAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
// types
import { InitialFormValues as OwnBankAccount } from './utils';
import { VendorList } from 'types/masters';


interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  //ownBankAccount?: OwnBankAccount | null;
  ownBankAccount?: VendorList | null;

  ownBankAccountRefetch: any;
}

// ==============================|| VENDOR ADD / EDIT ||============================== //

export default function OwnBankAccountModal({ open, modalToggler, ownBankAccount, ownBankAccountRefetch }: Props) {
  const closeModal = () => {
    modalToggler(false);
    // vendorRefetch();
  };

  const OwnBankAccountForm = useMemo(
    () => (
      <FormOwnBankAccountAdd
        ownBankAccount={ownBankAccount || null}
        closeModal={closeModal}
        ownBankAccountRefetch={ownBankAccountRefetch}
      />
    ),
    // eslint-disable-next-line
    [ownBankAccount]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-employee-add-label"
          aria-describedby="modal-employee-add-description"
          sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
        >
          <MainCard
            sx={{
              width: `calc(100% - 48px)`,
              minWidth: 340,
              maxWidth: 800,
              height: 'auto',
              minHeight: '300px',
              maxHeight: 'calc(100vh - 48px)'
            }}
            modal
            content={false}
          >
            <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              {OwnBankAccountForm}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
