import { useMemo } from 'react';

// project imports
import FormProjectAdd from './FormProjectAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import { useGetProject } from 'api/project';

// types
import { ProjectList } from 'types/project';
import { Box, Dialog, DialogContent } from '@mui/material';
import { Stack } from '@mui/material';
import CircularWithPath from '../../../components/@extended/progress/CircularWithPath';
import { PopupTransition } from 'components/@extended/Transitions';

interface Props {
  open: boolean;
  modalToggler: (state: boolean) => void;
  project?: ProjectList | null;
  refetch: () => void;
}

// ==============================|| PROJECT ADD / EDIT ||============================== //

export default function ProjectModal({ open, modalToggler, project, refetch }: Props) {
  const { isLoading: loading } = useGetProject();

  const closeModal = () => modalToggler(false);

  const projectForm = useMemo(
    () => !loading && <FormProjectAdd project={project || null} closeModal={closeModal} getProjects={refetch} />,
    // eslint-disable-next-line
    [project, loading]
  );

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={PopupTransition}
        keepMounted={true}
        onClose={closeModal}
        sx={{
          '& .MuiDialog-paper': {
            width: { xs: '90%', md: '48%', sm: '90%' }
          }
        }}
      >
        <Box id="PopupPrint">
          <SimpleBar sx={{ height: 'max-content' }}>
            <DialogContent sx={{ p: 0 }}>
              <MainCard
                sx={
                  {
                    // minWidth: 340,
                    // maxWidth: 880,
                    // maxHeight: 'calc(100vh - 48px)'
                  }
                }
                content={false}
              >
                {loading ? (
                  <Box sx={{ p: 5 }}>
                    <Stack direction="row" justifyContent="center">
                      <CircularWithPath />
                    </Stack>
                  </Box>
                ) : (
                  projectForm
                )}
              </MainCard>
            </DialogContent>
          </SimpleBar>
        </Box>
      </Dialog>
    </>
  );
}
