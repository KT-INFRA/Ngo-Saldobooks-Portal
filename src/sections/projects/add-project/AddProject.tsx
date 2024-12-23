import { useEffect, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';

// project-imports
import FormProjectAdd from './FormProjectAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { handlerProjectDialog, useGetProject, useGetProjectMaster } from 'api/project';

// types
import { ProjectList } from 'types/project';
// ==============================|| PROJECT - ADD / EDIT ||============================== //

export default function AddProject() {
  const { projectMasterLoading, projectMaster } = useGetProjectMaster();
  const { isLoading: loading, projects } = useGetProject();
  const isModal = projectMaster?.modal;

  const [list, setList] = useState<ProjectList | null>(null);

  useEffect(() => {
    if (projectMaster?.modal && typeof projectMaster.modal === 'number') {
      const newList = projects.filter((info: any) => info?.id === isModal && info)[0];
      setList(newList);
    } else {
      setList(null);
    }
    // eslint-disable-next-line
  }, [projectMaster]);

  const closeModal = () => handlerProjectDialog(false);

  // eslint-disable-next-line

  return (
    <>
      {isModal && (
        <Modal
          open={true}
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
            <SimpleBar
              sx={{
                maxHeight: `max-content`,
                '& .simplebar-content': { display: 'flex', flexDirection: 'column' }
              }}
            >
              {loading && projectMasterLoading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                <FormProjectAdd project={list} closeModal={closeModal} getProjects={() => {}}/>
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}
