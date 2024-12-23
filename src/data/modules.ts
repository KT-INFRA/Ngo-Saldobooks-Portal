const moduleStructure = [
  {
    module_id: 1,
    module_name: 'Dashboard',
    user_type_id: 2,
    access: false,
    link: '',
    icon_name: '',
    module_button: [],
    sub_module: []
  },
  {
    module_id: 2,
    module_name: 'Projects',
    user_type_id: 2,
    access: false,
    link: '',
    icon_name: '',
    module_button: [],
    sub_module: [
      {
        sub_module_id: 1,
        sub_module_name: 'View Projects',
        user_type_id: 2,
        access: false,
        link: 'directory-home',
        icon_name: 'fa-solid fa-inbox',
        sub_module_button: [
          {
            sub_module_button: 1,
            sub_module_button_name: 'Add New Project',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 2,
            sub_module_button_name: 'Change PI',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 3,
            sub_module_button_name: 'Update Project Hierarchy',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 4,
            sub_module_button_name: 'Extend Project Duration',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 5,
            sub_module_button_name: 'Mark Project as Completed',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          }
        ]
      }
    ]
  },
  {
    module_id: 3,
    module_name: 'Accounts',
    user_type_id: 2,
    access: false,
    link: '',
    icon_name: '',
    module_button: [],
    sub_module: [
      {
        sub_module_id: 2,
        sub_module_name: 'Create Voucher',
        user_type_id: 2,
        access: false,
        link: 'createvoucher',
        icon_name: 'fa-solid fa-file-invoice-dollar',
        sub_module_button: [
          {
            sub_module_button: 41,
            sub_module_button_name: 'Credit Voucher For Other Source',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 39,
            sub_module_button_name: 'Debit Voucher for Bank Charges',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 13,
            sub_module_button_name: 'Settle Advance',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 7,
            sub_module_button_name: ' Credit Voucher for Bank Interest',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 11,
            sub_module_button_name: 'Debit Voucher for BankInterest Transfer',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 12,
            sub_module_button_name: 'Issue Advance to Employee/JRF',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 10,
            sub_module_button_name: 'Debit Voucher for JRF Fellowship',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 14,
            sub_module_button_name: 'Issue Internal Loan',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 15,
            sub_module_button_name: ' Settle Internal Loan',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 9,
            sub_module_button_name: 'Debit Voucher for Employee/JRF',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 6,
            sub_module_button_name: ' General Credit Voucher',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 8,
            sub_module_button_name: 'Debit Voucher for Vendor',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 40,
            sub_module_button_name: 'Debit Voucher for Project to Project',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          }
        ]
      },
      {
        sub_module_id: 3,
        sub_module_name: 'Credit Voucher',
        user_type_id: 2,
        access: false,
        link: 'creditvoucher',
        icon_name: 'fa-solid fa-file-arrow-down',
        sub_module_button: [
          {
            sub_module_button: 16,
            sub_module_button_name: 'View',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 17,
            sub_module_button_name: 'Confirm',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 18,
            sub_module_button_name: 'Approve',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 19,
            sub_module_button_name: 'Cancel',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          }
        ]
      },
      {
        sub_module_id: 4,
        sub_module_name: 'Debit Voucher',
        user_type_id: 2,
        access: false,
        link: 'debitvoucher',
        icon_name: 'fa-solid fa-file-arrow-up',
        sub_module_button: [
          {
            sub_module_button: 20,
            sub_module_button_name: 'View',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 21,
            sub_module_button_name: 'Confirm',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 22,
            sub_module_button_name: 'Approve',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 23,
            sub_module_button_name: 'Cancel',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 24,
            sub_module_button_name: 'Bank Letter Generation',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 38,
            sub_module_button_name: 'Edit',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          }
        ]
      },
      {
        sub_module_id: 5,
        sub_module_name: 'Journal Voucher',
        user_type_id: 2,
        access: false,
        link: 'journalvoucher',
        icon_name: 'fa-solid fa-receipt',
        sub_module_button: [
          {
            sub_module_button: 46,
            sub_module_button_name: 'Confirm',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 25,
            sub_module_button_name: 'View',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          }
        ]
      },
      {
        sub_module_id: 6,
        sub_module_name: 'View Advances',
        user_type_id: 2,
        access: false,
        link: 'viewadvance',
        icon_name: 'fa-solid fa-money-bill-1',
        sub_module_button: [
          {
            sub_module_button: 26,
            sub_module_button_name: 'View',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 27,
            sub_module_button_name: 'Settle ',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          }
        ]
      },
      {
        sub_module_id: 7,
        sub_module_name: 'View Internal Loan',
        user_type_id: 2,
        access: false,
        link: 'viewinternalloan',
        icon_name: 'fa-solid fa-money-bill-transfer',
        sub_module_button: [
          {
            sub_module_button: 28,
            sub_module_button_name: 'View',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 29,
            sub_module_button_name: 'Settle ',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          }
        ]
      }
    ]
  },
  {
    module_id: 4,
    module_name: 'Payroll',
    user_type_id: 2,
    access: false,
    link: '',
    icon_name: '',
    module_button: [],
    sub_module: [
      {
        sub_module_id: 8,
        sub_module_name: 'Upload Pay Bill Excel',
        user_type_id: 2,
        access: false,
        link: 'Upload Pay Bill Excel',
        icon_name: 'fa-solid fa-upload',
        sub_module_button: []
      },
      {
        sub_module_id: 9,
        sub_module_name: 'Generate Payslip',
        user_type_id: 2,
        access: false,
        link: 'Generate Payslip',
        icon_name: 'fa-solid fa-hard-drive',
        sub_module_button: [
          {
            sub_module_button: 30,
            sub_module_button_name: 'Generate',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          }
        ]
      },
      {
        sub_module_id: 10,
        sub_module_name: 'Download Payslip',
        user_type_id: 2,
        access: false,
        link: 'View Payslip',
        icon_name: 'fa-solid fa-file-invoice',
        sub_module_button: []
      }
    ]
  },
  {
    module_id: 5,
    module_name: 'Reports',
    user_type_id: 2,
    access: false,
    link: '',
    icon_name: '',
    module_button: [],
    sub_module: [
      {
        sub_module_id: 11,
        sub_module_name: 'Account',
        user_type_id: 2,
        access: false,
        link: 'Account',
        icon_name: '',
        sub_module_button: []
      },
      {
        sub_module_id: 12,
        sub_module_name: 'Projects',
        user_type_id: 2,
        access: false,
        link: 'Projects',
        icon_name: '',
        sub_module_button: [
          {
            sub_module_button: 43,
            sub_module_button_name: 'Utitilization Report 12_C',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 44,
            sub_module_button_name: 'Utitilization Report 12_A',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 45,
            sub_module_button_name: 'Sanction Order Report',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 31,
            sub_module_button_name: 'Cash Book Report',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 32,
            sub_module_button_name: 'Ledger Report',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 33,
            sub_module_button_name: 'Annual Trial Balance Report',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 34,
            sub_module_button_name: 'Quaterly Trial Balance Report',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 35,
            sub_module_button_name: 'Monthly Trial Balance Report',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          },
          {
            sub_module_button: 36,
            sub_module_button_name: 'Annual Report',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          }
        ]
      },
      {
        sub_module_id: 13,
        sub_module_name: 'Payroll',
        user_type_id: 2,
        access: false,
        link: 'Payroll',
        icon_name: '',
        sub_module_button: [
          {
            sub_module_button: 37,
            sub_module_button_name: 'Payroll Report',
            user_type_id: 2,
            access: false,
            link: '',
            icon_name: ''
          }
        ]
      }
    ]
  },
  {
    module_id: 6,
    module_name: 'Settings',
    user_type_id: 2,
    access: false,
    link: '',
    icon_name: '',
    module_button: [],
    sub_module: [
      {
        sub_module_id: 14,
        sub_module_name: 'Manage Employees',
        user_type_id: 2,
        access: false,
        link: 'Manage Employees',
        icon_name: '',
        sub_module_button: []
      },
      {
        sub_module_id: 15,
        sub_module_name: 'Manage Vendors ',
        user_type_id: 2,
        access: false,
        link: 'ManageVendors',
        icon_name: '',
        sub_module_button: []
      },
      {
        sub_module_id: 16,
        sub_module_name: 'Manage Account Head',
        user_type_id: 2,
        access: false,
        link: 'Manage Account Head',
        icon_name: '',
        sub_module_button: []
      },
      {
        sub_module_id: 17,
        sub_module_name: 'Manage Tax (GST, TDS)',
        user_type_id: 2,
        access: false,
        link: 'Manage Tax',
        icon_name: '',
        sub_module_button: []
      },
      {
        sub_module_id: 18,
        sub_module_name: 'Manage Funding Agencies',
        user_type_id: 2,
        access: false,
        link: 'Manage Funding Agencies',
        icon_name: '',
        sub_module_button: []
      },
      {
        sub_module_id: 19,
        sub_module_name: 'Manage Project Category',
        user_type_id: 2,
        access: false,
        link: 'Manage Project Category',
        icon_name: '',
        sub_module_button: []
      },
      {
        sub_module_id: 20,
        sub_module_name: 'Manage Own Bank Accounts',
        user_type_id: 2,
        access: false,
        link: 'Manage Own Bank Accounts',
        icon_name: '',
        sub_module_button: []
      }
    ]
  }
];

export default moduleStructure;
