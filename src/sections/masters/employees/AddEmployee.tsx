import { useEffect, useMemo, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';

// project-imports
import FormEmployeeAdd from './FormEmployeeAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { handlerEmployeeDialog, useGetEmployee, useGetEmployeeMaster } from 'api/masters';

// types
import { EmployeeList } from 'types/masters';

// ==============================|| EMPLOYEE - ADD / EDIT ||============================== //

export default function AddEmployee() {
  const { employeeMasterLoading, employeeMaster } = useGetEmployeeMaster();
  const { employeesLoading: loading, employees } = useGetEmployee();
  const isModal = employeeMaster?.modal;

  const [list, setList] = useState<EmployeeList | null>(null);

  useEffect(() => {
    if (employeeMaster?.modal && typeof employeeMaster.modal === 'number') {
      const newList = employees.filter((info) => info.id === isModal && info)[0];
      setList(newList);
    } else {
      setList(null);
    }
    // eslint-disable-next-line
  }, [employeeMaster]);

  const closeModal = () => handlerEmployeeDialog(false);

  // eslint-disable-next-line
  const employeeForm = useMemo(
    () => !loading && !employeeMasterLoading && <FormEmployeeAdd employee={list} closeModal={closeModal} employeeRefetch={() => {}} />,
    [list, loading, employeeMasterLoading]
  );

  return (
    <>
      {isModal && (
        <Modal
          open={true}
          onClose={closeModal}
          aria-labelledby="modal-employee-add-label"
          aria-describedby="modal-employee-add-description"
          sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar
              sx={{
                maxHeight: `calc(100vh - 48px)`,
                '& .simplebar-content': { display: 'flex', flexDirection: 'column' }
              }}
            >
              {loading && employeeMasterLoading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                employeeForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
