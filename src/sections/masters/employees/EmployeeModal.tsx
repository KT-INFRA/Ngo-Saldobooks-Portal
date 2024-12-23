import { useMemo } from 'react';

// material-ui
import Modal from '@mui/material/Modal';
// project imports
import FormEmployeeAdd from './FormEmployeeAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
// types
import { EmployeeDataTypes } from 'types/masters';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  employee?: EmployeeDataTypes | null;
  employeeRefetch: any;
}

// ==============================|| EMPLOYEE ADD / EDIT ||============================== //

export default function EmployeeModal({ open, modalToggler, employee, employeeRefetch }: Props) {
  const closeModal = () => {
    modalToggler(false);
    // employeeRefetch();
  };

  const employeeForm = useMemo(
    () => <FormEmployeeAdd employee={employee || null} closeModal={closeModal} employeeRefetch={employeeRefetch} />,
    // eslint-disable-next-line
    [employee]
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
              {employeeForm}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
