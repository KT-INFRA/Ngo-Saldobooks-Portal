import { useMemo } from 'react';
import Modal from '@mui/material/Modal';

// project imports
import FormAccountHeadAdd from './FormAccountHeadAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
// types
import { ProjectGroup } from 'types/masters';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  accountHead?: ProjectGroup | null;
  accountHeadRefetch: any;
}

// ==============================|| VENDOR ADD / EDIT ||============================== //

export default function AccountHeadModal({ open, modalToggler, accountHead, accountHeadRefetch }: Props) {
  const closeModal = () => {
    modalToggler(false);
    // vendorRefetch();
  };

  const AccountHeadForm = useMemo(
    () => <FormAccountHeadAdd accountHead={accountHead || null} closeModal={closeModal} accountHeadRefetch={accountHeadRefetch} />,
    // eslint-disable-next-line
    [accountHead]
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
              {AccountHeadForm}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
