import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormProjectAdd from './FormProjectAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { useGetProject } from 'api/project';

// types
import { ProjectList } from 'types/project';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  project?: ProjectList | null;
}

// ==============================|| PROJECT ADD / EDIT ||============================== //

export default function ProjectModal({ open, modalToggler, project }: Props) {
  const { isLoading: loading } = useGetProject();

  const closeModal = () => modalToggler(false);

  const projectForm = useMemo(
    () => !loading && <FormProjectAdd project={project || null} closeModal={closeModal} />,
    // eslint-disable-next-line
    [project, loading]
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
              {loading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                projectForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
