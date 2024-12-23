import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CreditVoucher from './CreditVoucher';
import JournalVoucher from './JournalVoucher';
import DebitVoucher from './DebitVoucher';
import GenerateBankLetter from './GenerateBankLetter';
//import { getUserModuleData } from 'utils/modules';
import { getUserModuleData, SubModuleButtonEnum, SubModuleEnum, UserModuleEnum } from 'utils/modules';
import { useMemo } from 'react';
export default function ViewVoucher() {
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  //const projectModule: any = useMemo(() => getUserModuleData(3, 4), []); //moduleId,submoduleId
  const projectModule: any = useMemo(() => getUserModuleData(UserModuleEnum.Accounts, SubModuleEnum.Accounts.DebitVoucher), []); //moduleId,submoduleId
  const projectModule_credit: any = useMemo(() => getUserModuleData(UserModuleEnum.Accounts, SubModuleEnum.Accounts.CreditVoucher), []); //moduleId,submoduleId
  const projectModule_debit: any = useMemo(() => getUserModuleData(UserModuleEnum.Accounts, SubModuleEnum.Accounts.DebitVoucher), []); //moduleId,submoduleId
  const projectModule_journal: any = useMemo(() => getUserModuleData(UserModuleEnum.Accounts, SubModuleEnum.Accounts.JournalVoucher), []); //moduleId,submoduleId

  const permission_view =
    projectModule?.sub_module_button?.find(
      (button: any) => button?.sub_module_button === SubModuleButtonEnum.Accounts.DebitVoucher.BankLetterGeneration
    )?.access ?? false;
  const permission_view_credit =
    projectModule_credit?.sub_module_button?.find(
      (button: any) => button?.sub_module_button === SubModuleButtonEnum.Accounts.CreditVoucher.View
    )?.access ?? false;
  const permission_view_debit =
    projectModule_debit?.sub_module_button?.find(
      (button: any) => button?.sub_module_button === SubModuleButtonEnum.Accounts.DebitVoucher.View
    )?.access ?? false;
  const permission_view_journal =
    projectModule_journal?.sub_module_button?.find(
      (button: any) => button?.sub_module_button === SubModuleButtonEnum.Accounts.JournalVoucher.View
    )?.access ?? false;


  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {/* <Tab label="Credit Voucher" value="1" />
            <Tab label="Debit Voucher" value="2" />
            <Tab label="Journal Voucher" value="3" /> */}
            {permission_view_credit && <Tab label="Credit Voucher" value="1" />}
            {permission_view_debit && <Tab label="Debit Voucher" value="2" />}
            {permission_view_journal && <Tab label="Journal Voucher" value="3" />}
            {permission_view && <Tab label="Generate Bank Letter" value="4" />}

          </TabList>
        </Box>
        <TabPanel value="1">{<CreditVoucher />} </TabPanel>
        <TabPanel value="2"> {<DebitVoucher />}</TabPanel>
        <TabPanel value="3">{<JournalVoucher />}</TabPanel>
        {/* <TabPanel value="4">{'Generate Bank Letter'}</TabPanel> */}
        <TabPanel value="4">{<GenerateBankLetter />}</TabPanel>
      </TabContext>
    </Box>
  );
}
