import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
// utils
import axiosServices, { fetcher } from 'utils/axios';

// types
import { EmployeeList, EmployeeProps } from 'types/masters';
import { axiosAuthServices } from 'utils/axios';
import { getUserData } from 'contexts/AuthContext';
//import { useQuery } from '@tanstack/react-query';

const initialState: EmployeeProps = {
  modal: false
};
export const endpoints = {
  key: 'api/employee',
  list: '/list', // server URL
  modal: '/modal', // server URL
  insert: '/insert', // server URL
  update: '/update', // server URL
  delete: '/delete' // server URL
};

export function useGetEmployee() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      employees: data?.employees as EmployeeList[],
      employeesLoading: isLoading,
      employeesError: error,
      employeesValidating: isValidating,
      employeesEmpty: !isLoading && !data?.employees?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function insertEmployee(newEmployee: EmployeeList) {
  // to update local state based on key
  mutate(
    endpoints.key + endpoints.list,
    (currentEmployee: any) => {
      newEmployee.id = currentEmployee.employees.length + 1;
      const addedEmployee: EmployeeList[] = [...currentEmployee.employees, newEmployee];

      return {
        ...currentEmployee,
        employees: addedEmployee
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { newEmployee };
  //   await axios.post(endpoints.key + endpoints.insert, data);
}
// ---------------------------PREFIX-----------------------
export const useGetPrefix = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['payroll/serve/prefix/list/'],
    queryFn: async () => axiosServices.get(`payroll/serve/prefix/list/`),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      label: item['short_name'],
      value: item['id']
    }));
  }, [data?.data]);
  return {
    prefixData: formattedData,
    loading: isLoading
  };
};
// --------------------------------------------------------
// ---------------------------DIVISION-----------------------
export const useGetDivision = () => {
  const { business_id } = getUserData();
  const { isLoading, data } = useQuery({
    queryKey: [`payroll/serve/employee/division/list/?b=${business_id}`],
    queryFn: async () => axiosServices.get(`payroll/serve/employee/division/list/?b=${business_id}`),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      label: item['name'],
      value: item['id']
    }));
  }, [data?.data]);
  return {
    divisionData: formattedData,
    loading: isLoading
  };
};
// --------------------------------------------------------
// ---------------------------DESIGNATION------------------
export const useGetDesignation = () => {
  const { business_id } = getUserData();
  const { isLoading, data } = useQuery({
    queryKey: [`payroll/serve/employee/designation/list/?b=${business_id}`],
    queryFn: async () => axiosServices.get(`payroll/serve/employee/designation/list/?b=${business_id}`),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      label: item['name'],
      value: item['id']
    }));
  }, [data?.data]);
  return {
    designationData: formattedData,
    loading: isLoading
  };
};
// --------------------------------------------------------
// ---------------------------DEPARTMENT------------------
export const useGetDepartment = () => {
  const { business_id } = getUserData();
  const { isLoading, data } = useQuery({
    queryKey: [`payroll/serve/employee/department/list/?b=${business_id}`],
    queryFn: async () => axiosServices.get(`payroll/serve/employee/department/list/?b=${business_id}`),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      label: item['name'],
      value: item['id']
    }));
  }, [data?.data]);
  return {
    departmentData: formattedData,
    loading: isLoading
  };
};
// --------------------------------------------------------
// ---------------------------GROUP------------------
export const useGetGroup = () => {
  const { business_id } = getUserData();
  const { isLoading, data } = useQuery({
    queryKey: [`payroll/serve/employee/group/list/?b=${business_id}`],
    queryFn: async () => axiosServices.get(`payroll/serve/employee/group/list/?b=${business_id}`),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      label: item['name'],
      value: item['id']
    }));
  }, [data?.data]);
  return {
    groupData: formattedData,
    loading: isLoading
  };
};
// --------------------------------------------------------
// ---------------------------EMP PAY LEVEL------------------
export const useGetEmpPayLevel = () => {
  const { business_id } = getUserData();
  const { isLoading, data } = useQuery({
    queryKey: [`payroll/serve/employee/paylevel/list/?b=${business_id}`],
    queryFn: async () => axiosServices.get(`payroll/serve/employee/paylevel/list/?b=${business_id}`),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      label: item['paycommission_level_name'],
      value: item['id']
    }));
  }, [data?.data]);
  return {
    empPayLevelData: formattedData,
    loading: isLoading
  };
};
// --------------------------------------------------------
// --------------------GET EMPLOYEE---------------
export function useGetEmployeeList() {
  const { business_id } = getUserData();
  const queryParams = {
    b: String(business_id)
    // offset: page,
    // limit: limit,
  };
  const queryKey = `/payroll/serve/employee/?${new URLSearchParams(queryParams).toString()}`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const results = data?.data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      employees: results,
      employeesLoading: isPending,
      employeesError: error,
      // vouchersValidating: isPending,
      // totalVouchers: results?.total ?? 0,
      //hasNextPage: results?.next_page,
      refetch: refetch
    }),
    [results, isPending, error, refetch]
  );

  return memoizedValue;
}
// -----------------------------------------------
// ------------INSERT EMP--------------
export const useInsertEmployee = (onSuccess = (data: any) => {}, onError = (error: any) => {}) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/payroll/register/employee/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    insertEmployee: mutateAsync
  };
};
// --------------------GET EMPLOYEE---------------
export function useGetUserTypeList() {
  const { business_id } = getUserData();
  const queryParams = {
    b: String(business_id),
    a: '1'
  };
  const queryKey = `/user/usertype/list/?${new URLSearchParams(queryParams).toString()}`;
  const { data } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosAuthServices.get(queryKey)
    //enabled: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data ?? [])].map((item: any) => ({
      label: item['user_type_name'],
      value: item['usertype_id']
    }));
  }, [data?.data]);
  return {
    employeesUserTypes: formattedData
    //loading: isLoading
  };
}
// -----------------------------------------------
export async function updateEmployee(employeeId: number, updatedEmployee: EmployeeList) {
  // to update local state based on key
  mutate(
    endpoints.key + endpoints.list,
    (currentEmployee: any) => {
      const newEmployee: EmployeeList[] = currentEmployee.employees.map((employee: EmployeeList) =>
        employee.id === employeeId ? { ...employee, ...updatedEmployee } : employee
      );

      return {
        ...currentEmployee,
        employees: newEmployee
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { list: updatedEmployee };
  //   await axios.post(endpoints.key + endpoints.update, data);
}

export async function deleteEmployee(employeeId: number) {
  // to update local state based on key
  mutate(
    endpoints.key + endpoints.list,
    (currentEmployee: any) => {
      const nonDeletedEmployee = currentEmployee.employees.filter((employee: EmployeeList) => employee.id !== employeeId);

      return {
        ...currentEmployee,
        employees: nonDeletedEmployee
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { employeeId };
  //   await axios.post(endpoints.key + endpoints.delete, data);
}

export function useGetEmployeeMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.modal, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      employeeMaster: data,
      employeeMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerEmployeeDialog(modal: boolean) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.modal,
    (currentEmployeemaster: any) => {
      return { ...currentEmployeemaster, modal };
    },
    false
  );
}

export function useGetCreditVouchers({ status = 0, projectCode = 0, voucherNo = '', page = 1, limit = 10 }: any) {
  const { business_id } = getUserData();
  const queryParams = {
    b: business_id,
    offset: page,
    limit: limit,
    ...(status !== 0 && status !== 4 && { status: status.toString() }),
    ...(projectCode !== 0 && { project_id: projectCode.toString() }),
    ...(voucherNo && { voucher_number: voucherNo }),
    ...(status === 4 && { voucher_category_id: '2' })
  };
  const queryKey = `/main/serve/credit/voucher/?${new URLSearchParams(queryParams).toString()}`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey],
    queryFn: () => axiosServices.get(queryKey),
    enabled: false
  });
  const results = data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      vouchers: results?.data?.data,
      vouchersLoading: isPending,
      vouchersError: error,
      vouchersValidating: isPending,
      totalVouchers: results?.total ?? 0,
      hasNextPage: results?.next_page,
      refetch: refetch
    }),
    [results?.data?.data, results?.total, results?.next_page, isPending, error, refetch]
  );

  return memoizedValue;
}

// ------------------VENDOR-----------------------------
// --------------------GET VENDOR---------------
export function useGetVendorList() {
  const { business_id } = getUserData();
  const queryParams = {
    b: String(business_id)
    // offset: page,
    // limit: limit,
  };
  const queryKey = `/main/serve/vendor/?${new URLSearchParams(queryParams).toString()}`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const results = data?.data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      vendors: results,
      vendorsLoading: isPending,
      vendorsError: error,
      //hasNextPage: results?.next_page,
      refetch: refetch
    }),
    [results, isPending, error, refetch]
  );

  return memoizedValue;
}
// -----------------------------------------------
// ------------INSERT VENDOR--------------
export const useInsertVendor = (onSuccess = (data: any) => {}, onError = (error: any) => {}) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/vendor/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    insertVendor: mutateAsync
  };
};
// ------------UPDATE VENDOR--------------
export const useUpdateVendor = (onSuccess = (data: any) => {}, onError = (error: any) => {}) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.put(`/main/update/vendor/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    updateVendor: mutateAsync
  };
};
// ---------------DELETE VENDOR-------------------
export function useDeleteVendor({ id }: any) {
  const { business_id } = getUserData();
  const queryParams = {
    business_id: String(business_id),
    id: id
  };
  const mutationKey = `/main/delete/vendor/?${new URLSearchParams(queryParams).toString()}`;
  const { data, isPending, error, mutateAsync } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: () => axiosServices.delete(mutationKey)
  });
  const results = data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      vendorDelete: results,
      vendorDeleteLoading: isPending,
      vendorDeleteError: error,
      deleteVendor: mutateAsync
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [results, mutateAsync]
  );

  return memoizedValue;
}
// --------------------GET PROJECTGROUP---------------
export function useGetProjectGroupList() {
  const { business_id } = getUserData();
  const queryParams = {
    b: String(business_id)
  };
  const queryKey = `/main/serve/project/group/list/?${new URLSearchParams(queryParams).toString()}`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const results = data?.data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      ProjectGroup: results,
      ProjectGroupLoading: isPending,
      ProjectGroupError: error,
      refetch: refetch
    }),
    [results, isPending, error, refetch]
  );

  return memoizedValue;
}
// -----------------------------------------------
// ------------INSERT PROJECT GROUP--------------
export const useInsertProjectGroup = (onSuccess = (data: any) => {}, onError = (error: any) => {}) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/project-group/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    insertProjectGroup: mutateAsync
  };
};
// ------------DELETE PROJECT GROUP--------------

export function useDeleteProjectGroup({ id }: any) {
  const { business_id } = getUserData();
  const queryParams = {
    business_id: String(business_id),
    id: id
  };
  const mutationKey = `/main/create/project-group/?${new URLSearchParams(queryParams).toString()}`;
  const { data, isPending, error, mutateAsync } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: () => axiosServices.delete(mutationKey)
  });
  const results = data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      projectGroupDelete: results,
      projectGroupDeleteLoading: isPending,
      projectGroupDeleteError: error,
      deleteProjectGroup: mutateAsync
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [results, mutateAsync]
  );

  return memoizedValue;
}
// ------------------FUNDING AGENCY-----------------------------
// --------------------GET FUNDING AGENCY---------------
export function useGetFundingAgencyList() {
  const { business_id } = getUserData();
  const queryParams = {
    b: String(business_id)
    // offset: page,
    // limit: limit,
  };
  const queryKey = `/main/serve/fund/agency/?${new URLSearchParams(queryParams).toString()}`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const results = data?.data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      fundingAgency: results,
      fundingAgencyLoading: isPending,
      fundingAgencyError: error,
      //hasNextPage: results?.next_page,
      refetch: refetch
    }),
    [results, isPending, error, refetch]
  );

  return memoizedValue;
}
// -----------------------------------------------
// ------------INSERT FUNDING AGENCY--------------
export const useInsertFundingAgency = (onSuccess = (data: any) => {}, onError = (error: any) => {}) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/add/fund-agency/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    insertFundingAgency: mutateAsync
  };
};

// --------------------GET TAX---------------
export function useGetTaxList(value: string) {
  const { business_id } = getUserData();
  var queryKey: string;
  const queryParams = {
    b: String(business_id),
    type: value
  };
  if (value === 'TDS') {
    queryKey = `/main/serve/tds/list/?${new URLSearchParams(queryParams).toString()}`;
  } else if (value === 'GST') {
    queryKey = `/main/serve/gst/list/?${new URLSearchParams(queryParams).toString()}`;
  } else {
    queryKey = `/main/serve/cess/list/?${new URLSearchParams(queryParams).toString()}`;
  }
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const results = data?.data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      Tax: results,
      TaxLoading: isPending,
      TaxError: error,
      //hasNextPage: results?.next_page,
      refetch: refetch
    }),
    [results, isPending, error, refetch]
  );

  return memoizedValue;
}
// -----------------------------------------------
// ------------INSERT PROJECT GROUP--------------
export const useInsertTax = (onSuccess = (data: any) => {}, onError = (error: any) => {}) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/tax-name/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    insertTax: mutateAsync
  };
};
// ------------------ACCOUNT HEAD------------------------
export function useGetCommonAccountHeadList() {
  const queryKey = `/main/serve/common/account-head/`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey],
    queryFn: () => axiosServices.get(queryKey)
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const results = data?.data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      CommonAccountHead: results,
      CommonAccountHeadLoading: isPending,
      CommonAccountHeadError: error,
      refetch: refetch
    }),
    [results, isPending, error, refetch]
  );

  return memoizedValue;
}
export function useGetAccountHeadList() {
  const { business_id } = getUserData();
  const queryParams = {
    b: String(business_id)
    // offset: page,
    // limit: limit,
  };
  const queryKey = `/main/serve/account-head/?${new URLSearchParams(queryParams).toString()}`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const results = data?.data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      AccountHead: results,
      AccountHeadLoading: isPending,
      AccountHeadError: error,
      //hasNextPage: results?.next_page,
      refetch: refetch
    }),
    [results, isPending, error, refetch]
  );

  return memoizedValue;
}
// ------------------DELETE ACCOUNT HEAD-----------------------------
export function useDeleteAccountHead({ id }: any) {
  const { business_id } = getUserData();
  const queryParams = {
    b: String(business_id),
    account_head_id: id
  };
  const mutationKey = `/main/delete/account-head/?${new URLSearchParams(queryParams).toString()}`;
  const { data, isPending, error, mutateAsync } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: () => axiosServices.delete(mutationKey)
  });
  const results = data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      accountHeadDelete: results,
      accountHeadDeleteLoading: isPending,
      accountHeadDeleteError: error,
      deleteAccountHead: mutateAsync
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [results, mutate]
  );

  return memoizedValue;
}
// ---------------------------ACCOUNT HEAD FOR DROPDOWN-----------------------
export const useGetAccountHead = () => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['main/serve/common/account-head'],
    queryFn: async () => axiosServices.get(`main/serve/common/account-head/`)
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
    // refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      label: item['name'],
      value: item['id']
    }));
  }, [data?.data]);
  return {
    accountHeadData: formattedData,
    loading: isLoading,
    refetch: refetch
  };
};
// ------------INSERT ACCOUNT HEAD FOR BUSSINESS--------------
export const useInsertAccountHead = (onSuccess = (data: any) => {}, onError = (error: any) => {}) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/add/business/account-head/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    insertAccountHead: mutateAsync
  };
};
// --------------OWN BANK ACCOUNT--------------
export function useGetOwnBankAccountList() {
  const { business_id } = getUserData();
  const queryParams = {
    b: String(business_id)
    // offset: page,
    // limit: limit,
  };
  const queryKey = `/main/serve/bank/?${new URLSearchParams(queryParams).toString()}`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const results = data?.data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      OwnBankAccount: results,
      OwnBankAccountLoading: isPending,
      OwnBankAccountError: error,
      //hasNextPage: results?.next_page,
      refetch: refetch
    }),
    [results, isPending, error, refetch]
  );

  return memoizedValue;
}
// ------------INSERT OWN BANK ACCOUNT--------------
export const useInsertOwnBankAccount = (onSuccess = (data: any) => {}, onError = (error: any) => {}) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/add/own-bank/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    insertOwnBankAccount: mutateAsync
  };
};
// ------------INSERT NEW ACCOUNT HEAD--------------
export const useInsertNewAccountHead = (onSuccess = (data: any) => {}, onError = (error: any) => {}) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/add/account-head/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    insertNewAccountHead: mutateAsync
  };
};
