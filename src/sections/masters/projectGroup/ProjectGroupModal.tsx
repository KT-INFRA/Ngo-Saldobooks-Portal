import { useMemo } from 'react';
import Modal from '@mui/material/Modal';

// project imports
import FormProjectGroupAdd from './FormProjectGroupAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
// types
import { ProjectGroup } from 'types/masters';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  projectGroup?: ProjectGroup | null;
  projectGroupRefetch: any;
}

// ==============================|| VENDOR ADD / EDIT ||============================== //

export default function ProjectGroupModal({ open, modalToggler, projectGroup, projectGroupRefetch }: Props) {
  const closeModal = () => {
    modalToggler(false);
    // vendorRefetch();
  };

  const ProjectGroupForm = useMemo(
    () => <FormProjectGroupAdd projectGroup={projectGroup || null} closeModal={closeModal} projectGroupRefetch={projectGroupRefetch} />,
    // eslint-disable-next-line
    [projectGroup]
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
              {ProjectGroupForm}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
