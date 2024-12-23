import { useMemo } from 'react';
import Modal from '@mui/material/Modal';

// project imports
import FormVendorAdd from './FormVendorAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
// types
import { VendorList } from 'types/masters';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  vendor?: VendorList | null;
  vendorRefetch: any;
}

// ==============================|| VENDOR ADD / EDIT ||============================== //

export default function VendorModal({ open, modalToggler, vendor, vendorRefetch }: Props) {
  const closeModal = () => {
    modalToggler(false);
    // vendorRefetch();
  };

  const vendorForm = useMemo(
    () => <FormVendorAdd vendor={vendor || null} closeModal={closeModal} vendorRefetch={vendorRefetch} />,
    // eslint-disable-next-line
    [vendor]
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
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 800, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              {vendorForm}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
