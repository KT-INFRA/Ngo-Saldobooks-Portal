import { useMemo } from 'react';
import Modal from '@mui/material/Modal';

// project imports
import FormFundingAgencyAdd from './FormFundingAgencyAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
// types
import { FundingAgencyList } from 'types/masters';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  fundingAgency?: FundingAgencyList | null;
  fundingAgencyRefetch: any;
}

// ==============================|| VENDOR ADD / EDIT ||============================== //

export default function VendorModal({ open, modalToggler, fundingAgency, fundingAgencyRefetch }: Props) {
  const closeModal = () => {
    modalToggler(false);
    // fundingAgencyRefetch();
  };

  const FundingAgencyForm = useMemo(
    () => (
      <FormFundingAgencyAdd fundingAgency={fundingAgency || null} closeModal={closeModal} fundingAgencyRefetch={fundingAgencyRefetch} />
    ),
    // eslint-disable-next-line
    [fundingAgency]
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
              {FundingAgencyForm}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
