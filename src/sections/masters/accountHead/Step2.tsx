import { InputLabel } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { InitialFormValues } from './utils2';
import Autocomplete from '@mui/material/Autocomplete';
import { useGetAccountHead } from 'api/masters';
import LoadingButton from 'components/@extended/LoadingButton';
import { AddCircle } from 'iconsax-react';
import NewAccountHeadModal from './NewAccountHeadModal';
import { useMemo, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { getUserModuleData, SubModuleEnum, UserModuleEnum, SubModuleButtonEnum } from 'utils/modules';
//interface Step1Props {}
// eslint-disable-next-line no-empty-pattern
function Step2({ closeModal, accountHeadRefetch }: { closeModal: () => void; accountHeadRefetch: any }) {
  const { accountHeadData = [], refetch: getNewAccountHeadList } = useGetAccountHead();
  const [newAccountHeadModal, setNewAccountHeadModal] = useState<boolean>(false);
  const projectModule: any = useMemo(() => getUserModuleData(UserModuleEnum.Settings, SubModuleEnum.Settings.ManageAccountHead), []);
  const permission_add =
    projectModule?.sub_module_button?.find(
      (button: any) => button?.sub_module_button === SubModuleButtonEnum.Settings.ManageAccountHead.AddMasterAccountHead
    )?.access ?? false;
  // const { getFieldProps, touched, errors, values, setFieldValue, handleChange } = useFormikContext<InitialFormValues>();
  const { touched, errors, setFieldValue, values } = useFormikContext<InitialFormValues>();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <InputLabel htmlFor="account_head_id">Account Head </InputLabel>
        <Autocomplete
          sx={{
            '& .MuiInputBase-root': {
              height: '48px'
            },
            '& .MuiOutlinedInput-root': {
              padding: 0
            },
            '& .MuiAutocomplete-inputRoot': {
              padding: '0 14px'
            }
          }}
          onChange={(_e, project) => {
            setFieldValue('account_head_id', project?.value);
          }}
          multiple={false}
          defaultValue={accountHeadData.find((p) => p.value === values.account_head_id)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          id="account_head_id"
          options={accountHeadData}
          renderInput={(params) => (
            <TextField
              error={touched.account_head_id && Boolean(errors.account_head_id)}
              helperText={touched.account_head_id && errors.account_head_id}
              name="account_head_id"
              placeholder="Account Head"
              {...params}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <div style={{ marginTop: '20px' }}></div>
        {permission_add && (
          <Tooltip title="Add Common Account Head">
            <LoadingButton
              onClick={() => {
                setNewAccountHeadModal(true);
              }}
              size="large"
              color="primary"
              variant="contained"
              shape="square"
            >
              <AddCircle />
            </LoadingButton>
          </Tooltip>
        )}
      </Grid>
      <NewAccountHeadModal
        open={newAccountHeadModal}
        modalToggler={setNewAccountHeadModal}
        //projectGroup={selectedProjectGroup}
        newAccountHeadRefetch={getNewAccountHeadList}
        accHeadCloseModal={closeModal}
        accountHeadRefetch={accountHeadRefetch}
      />
    </Grid>
  );
}

export default Step2;
