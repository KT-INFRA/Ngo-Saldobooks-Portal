import { ModuleButton, UserModule, UserModuleResponseType, UserSubModule, UserSubModuleButton } from 'types/auth';
import storage from './storage';

export const UserModuleEnum = {
  Dashboard: 1,
  Projects: 2,
  Accounts: 3,
  Payroll: 4,
  Reports: 5,
  Settings: 6
};

export const SubModuleEnum = {
  Projects: {
    ViewProjects: 1
  },
  Accounts: {
    CreateVoucher: 2,
    CreditVoucher: 3,
    DebitVoucher: 4,
    JournalVoucher: 5,
    ViewAdvances: 6,
    ViewInternalLoan: 7
  },
  Payroll: {
    UploadPayBillExcel: 8,
    GeneratePayslip: 9,
    DownloadPayslip: 10
  },
  Reports: {
    Account: 11,
    Projects: 12,
    Payroll: 13
  },
  Settings: {
    ManageEmployees: 14,
    ManageVendors: 15,
    ManageAccountHead: 16,
    ManageTax: 17,
    ManageFundingAgencies: 18,
    ManageProjectCategory: 19,
    ManageOwnBankAccounts: 20
  }
};

export const SubModuleButtonEnum = {
  Projects: {
    ViewProjects: {
      AddNewProject: 1,
      ChangePI: 2,
      UpdateProjectHierarchy: 3,
      ExtendProjectDuration: 4,
      MarkProjectAsCompleted: 5,
      UpdateProjectBudgetSplit: 47
    }
  },
  Accounts: {
    CreateVoucher: {
      CreditVoucherForOtherSource: 41,
      DebitVoucherForBankCharges: 39,
      DebitVoucherForGeneral: 65,
      SettleAdvance: 13,
      CreditVoucherForBankInterest: 7,
      DebitVoucherForBankInterestTransfer: 11,
      IssueAdvanceToEmployeeJRF: 12,
      DebitVoucherForJRFellowship: 10,
      IssueInternalLoan: 14,
      SettleInternalLoan: 15,
      DebitVoucherForEmployeeJRF: 9,
      GeneralCreditVoucher: 6,
      DebitVoucherForVendor: 8,
      DebitVoucherForProjectToProject: 40
    },
    CreditVoucher: {
      View: 16,
      Confirm: 17,
      Approve: 18,
      Cancel: 19
    },
    DebitVoucher: {
      View: 20,
      Confirm: 21,
      Approve: 22,
      Cancel: 23,
      BankLetterGeneration: 24,
      Edit: 38
    },
    JournalVoucher: {
      Confirm: 46,
      View: 25,
      Cancel: 48
    },
    ViewAdvances: {
      View: 26,
      Settle: 27
    },
    ViewInternalLoan: {
      View: 28,
      Settle: 29
    }
  },
  Payroll: {
    GeneratePayslip: {
      Generate: 30
    }
  },
  Settings: {
    ManageEmployees: {
      AddEmployee: 49,
      ViewEmployee: 50
    },
    ManageVendors: {
      AddVendor: 51,
      ViewVendor: 52,
      UpdateVendor: 64,
      DeleteVendor: 63
    },
    ManageAccountHead: {
      AddAccountHead: 53,
      AddMasterAccountHead: 54,
      DeleteAccountHead: 55,
      ViewAccountHead: 56
    },
    ManageTax: {
      AddTax: 57
    },
    ManageFundingAgencies: {
      AddFundAgency: 58,
      ViewFundAgency: 59
    },
    ManageProjectCategory: {
      AddProjectGroup: 60,
      DeleteProjectGroup: 61
    },
    ManageOwnBankAccounts: {
      AddOwnBankAccount: 62
    }
  },
  Reports: {
    Projects: {
      UtitilizationReport12C: 43,
      UtitilizationReport12A: 44,
      SanctionOrderReport: 45,
      CashBookReport: 31,
      LedgerReport: 32,
      AnnualTrialBalanceReport: 33,
      QuaterlyTrialBalanceReport: 34,
      MonthlyTrialBalanceReport: 35,
      AnnualReport: 36
    },
    Payroll: {
      PayrollReport: 37
    }
  }
};

export const getUserModuleData = (
  moduleId: number,
  subModuleId: number = 0,
  buttonId: number = 0
): UserModule | UserSubModule | UserSubModuleButton | ModuleButton | null => {
  const userModules: UserModuleResponseType = storage.getItem('userModules') ?? { modules: [] };
  const userModule: UserModule | undefined = userModules.modules?.find((uModule: UserModule) => uModule.module_id === moduleId);

  // Return null if no userModule is found
  if (!userModule) {
    return null;
  }

  // Handle cases where subModuleId is 0 (no sub-module)
  if (subModuleId === 0) {
    // Return specific button if buttonId is greater than 0
    if (buttonId > 0 && userModule?.module_button?.length) {
      return userModule.module_button.find((moduleButton: ModuleButton) => moduleButton.module_button === buttonId) || null;
    }
    return userModule;
  }

  // Handle case for sub-modules
  const subModule: UserSubModule | undefined = userModule?.sub_module?.find(
    (subModule: UserSubModule) => subModule.sub_module_id === subModuleId
  );

  // Return null if no subModule is found
  if (!subModule) {
    return null;
  }

  // Return subModule if buttonId is 0 or no subModuleButtons exist
  if (buttonId === 0 || !subModule?.sub_module_button?.length) {
    return subModule;
  }

  // Find and return the specific button within the sub-module
  return subModule.sub_module_button.find((subModuleButton: UserSubModuleButton) => subModuleButton.sub_module_button === buttonId) || null;
};

export const getMenuUserModuleData = (
  modules: UserModule[] = [],
  moduleId: number,
  subModuleId: number = 0,
  buttonId: number = 0
): UserModule | UserSubModule | UserSubModuleButton | ModuleButton | null => {
  const userModule: UserModule | undefined = modules && modules?.find((uModule: UserModule) => uModule.module_id === moduleId);

  // Return null if no userModule is found
  if (!userModule) {
    return null;
  }

  // Handle cases where subModuleId is 0 (no sub-module)
  if (subModuleId === 0) {
    // Return specific button if buttonId is greater than 0
    if (buttonId > 0 && userModule?.module_button?.length) {
      return userModule.module_button.find((moduleButton: ModuleButton) => moduleButton.module_button === buttonId) || null;
    }
    return userModule;
  }

  // Handle case for sub-modules
  const subModule: UserSubModule | undefined = userModule?.sub_module?.find(
    (subModule: UserSubModule) => subModule.sub_module_id === subModuleId
  );

  // Return null if no subModule is found
  if (!subModule) {
    return null;
  }

  // Return subModule if buttonId is 0 or no subModuleButtons exist
  if (buttonId === 0 || !subModule?.sub_module_button?.length) {
    return subModule;
  }

  // Find and return the specific button within the sub-module
  return subModule.sub_module_button.find((subModuleButton: UserSubModuleButton) => subModuleButton.sub_module_button === buttonId) || null;
};
