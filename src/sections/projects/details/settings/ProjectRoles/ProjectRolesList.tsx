// material-ui
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TableContainer from '@mui/material/TableContainer';
import { Divider, Stack, TableHead, Tooltip } from '@mui/material';
import { Skeleton } from '@mui/material';
import { ShieldTick, Trash, UserRemove } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import dayjs from 'dayjs';
import AlertProjecRoleDelete from './AlertProjecRoleDelete';
import useModal from 'hooks/useModal';
import { useProjectRoleContext } from './util';
import AlertProjecRoleRetirement from './AlertProjecRoleRetirement';
// table dat

// ===========================|| DATA WIDGET - PROJECT TABLE ||=========================== //
interface IProjectRolesList {}

const accessBadge: { [key: number]: 'primary' | 'info' | 'warning' } = {
  1: 'primary',
  2: 'info',
  3: 'warning'
} as const;

// eslint-disable-next-line no-empty-pattern
export default function ProjectRolesList({}: IProjectRolesList) {
  const { isProjectRolesLoading, projectRoles, selectedRole, handleSetSelectedRole } = useProjectRoleContext()!;
  const { open: deleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { open: retirementOpen, openModal: openRetirementModal, closeModal: closeRetirementModal } = useModal();
  const sortedData = projectRoles.sort((a, b) => a.access_type_id - b.access_type_id);
  if (isProjectRolesLoading) {
    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>Employee</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Working Till</TableCell>
              <TableCell sx={{ pr: 3 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[0, 1, 2, 4].map((item: number) => (
              <TableRow key={item}>
                {[0, 1, 2, 3].map((col: number) => (
                  <TableCell key={col}>
                    <Skeleton animation="wave" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  return (
    <>
      <TableContainer>
        <Divider />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>Employee</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Working Till</TableCell>
              <TableCell sx={{ pr: 3 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => {
              const currentPi = Boolean(row?.access_type_id === 1 && !row?.expiration_date);
              return (
                <TableRow hover key={index}>
                  <TableCell sx={{ pl: 3 }}>
                    <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                      {/* <Grid item>
                      <Avatar variant="rounded" size="md" alt="coverimage" />
                    </Grid> */}
                      <Grid item xs zeroMinWidth>
                        <Typography variant="h6">
                          <Stack direction={'row'} gap={1}>
                            {row.prefix + ' ' + row.first_name + ' ' + row.last_name}{' '}
                            {currentPi && (
                              <Typography color={'success.main'}>
                                <ShieldTick size={20} />
                              </Typography>
                            )}
                          </Stack>
                        </Typography>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" variant="combined" color={accessBadge[row.access_type_id]} label={row.access_type}></Chip>
                  </TableCell>
                  <TableCell>
                    {row.access_type_id === 1 && (
                      <>
                        {row?.expiration_date ? (
                          <Typography>{dayjs(row?.expiration_date).format('DD/MM/YY hh:mm:A')}</Typography>
                        ) : (
                          <Chip variant="filled" color="success" size={'small'} label={'Current PI'}></Chip>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack direction={'row'} gap={1}>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          variant="text"
                          // size="small"
                          onClick={() => {
                            handleSetSelectedRole(row);
                            openDeleteModal();
                          }}
                        >
                          <Trash />
                        </IconButton>
                      </Tooltip>

                      {!row?.expiration_date ? (
                        <Tooltip title="Remove">
                          <IconButton
                            color="primary"
                            variant="text"
                            // size="small"
                            onClick={() => {
                              handleSetSelectedRole(row);
                              openRetirementModal();
                            }}
                          >
                            <UserRemove />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <div />
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedRole?.id ? <AlertProjecRoleDelete id={Number(selectedRole?.id)} handleClose={closeDeleteModal} open={deleteOpen} /> : null}
      {selectedRole?.id ? <AlertProjecRoleRetirement handleClose={closeRetirementModal} open={retirementOpen} /> : null}
    </>
  );
}
