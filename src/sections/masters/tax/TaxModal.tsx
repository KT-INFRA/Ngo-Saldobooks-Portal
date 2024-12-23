import { useMemo } from 'react';
import Modal from '@mui/material/Modal';

// project imports
import FormTaxAdd from './FormTaxAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
// types
import { TaxList } from 'types/masters';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  tax?: TaxList | null;
  TaxRefetch: any;
  selectedTax: string;
}

// ==============================|| VENDOR ADD / EDIT ||============================== //

export default function TaxModal({ open, modalToggler, tax, TaxRefetch, selectedTax }: Props) {
  const closeModal = () => {
    modalToggler(false);
    // vendorRefetch();
  };

  const TaxForm = useMemo(
    () => <FormTaxAdd tax={tax || null} closeModal={closeModal} TaxRefetch={TaxRefetch} selectedTax={selectedTax} />,
    // eslint-disable-next-line
    [tax,selectedTax]
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
              {TaxForm}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
