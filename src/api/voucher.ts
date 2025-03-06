import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { getUserData } from 'contexts/AuthContext';
import { FilterInitialValues } from 'pages/vouchers/view-advance/utils';
//import { Key } from 'iconsax-react';
import { useCallback, useMemo, useState } from 'react';
import { InternalLoanDetail, InternalLoanList, ViewAdvanceDetail, ViewAdvanceList } from 'types/vouchers';
import axiosServices from 'utils/axios';
interface QueryResponse<T> {
  data: {
    data: T[];
  };
}

interface Item {
  [key: string]: any;
}

export const buildUrlWithParams = (baseUrl: string, params: Record<string, any>): string => {
  const url = new URL(baseUrl, import.meta.env.VITE_APP_API_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
};

const useQueryData = <T extends Item>(
  queryKey: string[],
  queryFn: () => Promise<QueryResponse<T>>,
  labelKey: string = 'name',
  valueKey: string = 'id'
) => {
  const { isLoading, data } = useQuery({
    queryKey,
    queryFn,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  const formattedData = useMemo(() => {
    return [...(data?.data?.data || [])].map((item: any) => ({
      label: item[labelKey],
      value: item[valueKey]
    }));
  }, [data?.data?.data, labelKey, valueKey]);

  return {
    data: formattedData,
    loading: isLoading
  };
};

export const useGetPaymentType = () => {
  const { business_id } = getUserData();
  const { data, loading } = useQueryData([`/main/serve/payment/type/?b=${business_id}`], async () =>
    axiosServices.get(`/main/serve/payment/type/?b=${business_id}`)
  );

  const memoizedValue = useMemo(
    () => ({
      paymentTypes: data,
      paymentTypesLoading: loading
    }),
    [data, loading]
  );

  return memoizedValue;
};
export const useGetFundingAgency = () => {
  const { business_id } = getUserData();
  const { data, loading } = useQueryData([`/main/serve/fund-agency/?b=${business_id}`], async () =>
    axiosServices.get(`/main/serve/fund-agency/?b=${business_id}`)
  );

  const memoizedValue = useMemo(
    () => ({
      fundingAgencies: data,
      fundingAgencyLoading: loading
    }),
    [data, loading]
  );

  return memoizedValue;
};

export function useGetDonorList() {
  const { business_id } = getUserData();
  const queryParams = {
    b: String(business_id),
  };

  const queryKey = `/main/serve/donor_type/?${new URLSearchParams(queryParams).toString()}`;

  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey),
  });

  const results = data?.data?.data ?? [];

  const memoizedValue = useMemo(
    () => ({
      DonorList: results, 
      DonorListLoading: isPending,
      DonorError: error,
      refetch: refetch,
    }),
    [results, isPending, error, refetch]
  );

  return memoizedValue;
}

export const useGetBankName = (projectId = 1) => {
  const { business_id } = getUserData();
  const idParam = projectId !== null ? `&project_id=${projectId}` : '';
  const { data, loading } = useQueryData(
    [`/main/serve/bank/?b=${business_id}`],
    async () => axiosServices.get(`/main/serve/bank/?b=${business_id}${idParam}`),
    'bank_name',
    'bank_id'
  );
  const memoizedValue = useMemo(
    () => ({
      bankNames: data,
      bankNameLoading: loading
    }),
    [data, loading]
  );

  return memoizedValue;
};

export const useGetAccountHead = (aht: string[] = ['D']) => {
  const stringRepresentation = JSON.stringify(aht).replace(/"/g, "'");
  const { business_id } = getUserData();
  const { data, loading } = useQueryData([`/main/serve/account-head/?b=${business_id}&aht=${stringRepresentation}`], async () =>
    axiosServices.get(`/main/serve/account-head/?b=${business_id}&aht=${stringRepresentation}`)
  );

  const memoizedValue = useMemo(
    () => ({
      accountHeads: data,
      accountHeadLoading: loading
    }),
    [data, loading]
  );

  return memoizedValue;
};

export const useGetAccountHeadCommon = () => {
  const { data, loading } = useQueryData(['/main/serve/common/account-head/'], async () =>
    axiosServices.get(`/main/serve/common/account-head/`)
  );

  const memoizedValue = useMemo(
    () => ({
      accountHeads: data,
      accountHeadLoading: loading
    }),
    [data, loading]
  );

  return memoizedValue;
};

export const useGetIFGTBAccounts = (projectId = 1) => {
  const idParam = projectId !== null ? `&project_id=${projectId}` : '';
  const { data, loading } = useQueryData(
    ['/main/serve/bank/?b='],
    async () => axiosServices.get(`/main/serve/bank/?b=${1}${idParam}`),
    'bank_name',
    'bank_id'
  );
  const memoizedValue = useMemo(
    () => ({
      ifgtbAccounts: data,
      ifgtbAccountLoading: loading
    }),
    [data, loading]
  );

  return memoizedValue;
};

export const useGetProjectList = () => {
  const { user_id, business_id, is_executive } = getUserData();
  const key = `/main/serve/project/list/?u=${user_id}&b=${business_id}&executive=${is_executive}`;
  const { isLoading, data } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  const formattedData = useMemo(() => {
    return [...(data?.data?.data || [])].map((item: any) => ({
      label: item['project_code'],
      value: item['id']
    }));
  }, [data?.data?.data]);

  return {
    projects: formattedData,
    loading: isLoading
  };
};

// ---------------------FINANCIAL YEAY----------------------------
export const useGetFinancialYear = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['/main/serve/financial/year/'],
    queryFn: async () => axiosServices.get(`/main/serve/financial/year/`),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      label: item['financial_year'],
      value: item['financial_year']
    }));
  }, [data?.data]);
  return {
    financialYearData: formattedData,
    loading: isLoading
  };
};
// -------------------------------------------------
// ---------------------BANK LETTER FINANCIAL YEAY----------------------------
export const useGetBankLetterFinancialYear = (project_id: number) => {
  const { business_id } = getUserData();
  const key = `/main/serve/project/financial/year/?b=${business_id}&project_id=${project_id}`;
  const { isLoading, data } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      label: item['financial_year'],
      value: item['id'],
      project: item['project']
    }));
  }, [data?.data]);

  return {
    financialYearData: formattedData,
    loading: isLoading
  };
};
export const useGetBankLetterVoucherList = (project_id: number, financialYear?: number) => {
  const { business_id } = getUserData();
  const idParam = financialYear !== 0 ? `&project_fn_year_id=${financialYear}` : '';
  const key = `/main/serve/voucher/list/?b=${business_id}&project_id=${project_id}${idParam}`;
  const { isLoading, data } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      value: item['id'],
      label: item['number']
    }));
  }, [data?.data]);
  return {
    voucherListData: formattedData,
    loading: isLoading
  };
};
export const useGetBankLetterBankList = (project_id: number) => {
  const { business_id } = getUserData();
  const key = `/main/serve/bank/?b=${business_id}&project_id=${project_id}`;
  const { isLoading, data } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      value: item['account_number'],
      label: item['bank_name']
    }));
  }, [data?.data]);
  return {
    bankListData: formattedData,
    loading: isLoading
  };
};
// -------------------------------------------------

export const useGetVendorList = () => {
  const { business_id } = getUserData();
  const { isLoading, data } = useQuery({
    queryKey: [`/main/serve/vendor/?b=${business_id}`],
    queryFn: async () => axiosServices.get(`/main/serve/vendor/?b=${business_id}`),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  const formattedData = useMemo(() => {
    return [...(data?.data?.data || [])].map((item: any) => ({
      label: item['name'],
      value: item['id']
    }));
  }, [data?.data]);

  return {
    vendors: formattedData,
    loading: isLoading
  };
};

export const useGetEmployeeList = (noDestination = false) => {
  const { business_id } = getUserData();
  const { isLoading, data } = useQuery({
    queryKey: [`main/serve/employee/list/?b=${business_id}`],
    queryFn: async () => axiosServices.get(`main/serve/employee/list/?b=${business_id}`),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data || [])].map((item: any) => ({
      label: `${item['first_name']}${(!noDestination ? '' + item['designation'] || '' : '') || ''}`,
      value: item['employee_id'],
      ...item
    }));
  }, [data?.data?.data, noDestination]);

  return {
    employees: formattedData,
    loading: isLoading
  };
};

export const useGetJRFEmployeeList = (noDestination = false) => {
  const { business_id } = getUserData();
  const { isLoading, data } = useQuery({
    queryKey: [`/main/serve/jrf/employee/list/?b=${business_id}`],
    queryFn: async () => axiosServices.get(`/main/serve/jrf/employee/list/?b=${business_id}`),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const formattedData = useMemo(() => {
    return [...(data?.data?.data || [])].map((item: any) => ({
      label: `${item['first_name']}${(!noDestination ? '' + item['designation'] || '' : '') || ''}`,
      value: item['employee_id'],
      ...item
    }));
  }, [data?.data?.data, noDestination]);

  return {
    employees: formattedData,
    loading: isLoading
  };
};
export const useGetJRFDeductionList = () => {
  const { business_id } = getUserData();
  const { data, loading } = useQueryData([`/main/serve/jrf/deduction/list/?b=${business_id}`], async () =>
    axiosServices.get(`/main/serve/jrf/deduction/list/?b=${business_id}`)
  );
  return {
    deductions: data,
    loading: loading
  };
};

const useGetGSTORTDS = (type = 'gst') => {
  const { business_id } = getUserData();
  const { isLoading, data } = useQuery({
    queryKey: [`/main/serve/${type}/list/?b=${business_id}`],
    queryFn: async () => axiosServices.get(`/main/serve/${type}/list/?b=${business_id}`),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  // console.log('data', data)

  const formattedData = useMemo(() => {
    return [...(data?.data?.data || [])].map((item: any) => ({
      label: item['name'],
      value: item['id'],
      percent: item['percent']
    }));
  }, [data?.data]);

  return {
    data: formattedData,
    loading: isLoading
  };
};
export const useGetGSTList = () => {
  const { data, loading } = useGetGSTORTDS('gst');
  return {
    gstLists: data,
    loading: loading
  };
};
export const useGetTDSList = () => {
  const { data, loading } = useGetGSTORTDS('tds');
  return {
    tdsLists: data,
    loading: loading
  };
};

export const useCreateCreditVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/credit/voucher/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    createVoucher: mutateAsync
  };
};
export const useCreateOtherSourceCreditVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/credit/voucher/for/other/source/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    createVoucher: mutateAsync
  };
};
export const useCreateBankInterestCreditVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/bank-interest/voucher/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    createVoucher: mutateAsync
  };
};
export const useCreateBankInterestDebitVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/bank-interest/voucher/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    createVoucher: mutateAsync
  };
};
export const useCreateBankChargesDebitVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/project/bank/debit/voucher/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    createVoucher: mutateAsync
  };
};
export const useCreateDebitVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/debit/voucher/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    createVoucher: mutateAsync
  };
};
export const useCreateJRFDebitVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/jrf/debit/voucher/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    createVoucher: mutateAsync
  };
};

export const useCreatePTPDebitVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`main/create/project/voucher/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    createVoucher: mutateAsync
  };
};
export const useCreateAdvanceMngtVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/advance-management/voucher/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    createVoucher: mutateAsync
  };
};
export const useCreateInternalLoanVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/internal-loan/voucher/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    createVoucher: mutateAsync
  };
};
// -------------PDF---------
export const useGetCreditVoucherPdf = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/generate/credit/voucher`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    getCreditVoucherPdf: mutateAsync
  };
};
export const useGetJournalVoucherPdf = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/generate/journal/voucher`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    getJournalVoucherPdf: mutateAsync
  };
};
export const useGetDebitVoucherPdf = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/generate/debit/voucher`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    getDebitVoucherPdf: mutateAsync
  };
};
// ------------FORM CONFIRM VOUCHER--------------
export const useInsertCreditVoucherConfirmation = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.put(`/main/voucher/confirmed/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    creditVoucherConfirm: mutateAsync
  };
};
// -----------------------FORM CONFIRM JOURNAL VOUCHER----
export const useInsertJournalVoucherConfirmation = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.put(`/main/confirm/journal/voucher`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    journalVoucherConfirm: mutateAsync
  };
};
// ------------------FORM CONFIRM DEBIT VOUCHER----
export const useInsertDebitVoucherConfirmation = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.put(`/main/voucher/confirmed/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    debitVoucherConfirm: mutateAsync
  };
};
// ------------DELETE VOUCHER--------------
export const useDeleteVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.put(`/main/voucher/cancelled/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    deleteCreditVoucher: mutateAsync
  };
};
// ---------------DELETE DEBIT VOUCHER-----------
export const useDeleteDebitVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.put(`/main/voucher/cancelled/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    deleteDebitVoucher: mutateAsync
  };
};
// ------------DELETE VOUCHER--------------
export const useDeleteJournalVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.put(`/main/voucher/cancelled/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    deleteJournalVoucher: mutateAsync
  };
};
// ---------------APPROVAL DEBIT VOUCHER-----------
export const useApprovalDebitVoucher = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.put(`/main/voucher/approve/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    approveDebitVoucher: mutateAsync
  };
};

export function useGetCreditVouchers({ status = 0, projectCode = 0, voucherNo = '', financialYear, limit = 10 }: any) {
  const { business_id } = getUserData();
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const queryParams = {
    b: business_id,
    offset: page,
    limit: limit,
    ...(status !== 0 && status !== 4 && { status: status.toString() }),
    ...(projectCode !== 0 && { project_id: projectCode.toString() }),
    ...(voucherNo && { voucher_number: voucherNo }),
    ...(status === 4 && { voucher_category_id: '2' }),
    ...(financialYear && { financial_year: financialYear.toString() })
  };
  const queryKey = `/main/serve/credit/voucher/?${new URLSearchParams(queryParams).toString()}`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
    //enabled: false
  });
  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);
  const handleChangePageSize = useCallback((size: number) => {
    setItemPerPage(size);
  }, []);
  const results = data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      vouchers: results?.data?.data,
      vouchersLoading: isPending,
      vouchersError: error,
      vouchersValidating: isPending,
      totalVouchers: results?.data?.total ?? 0,
      // hasNextPage: results?.next_page,
      refetch: refetch,
      handleChangePage,
      handleChangePageSize,
      meta: {
        hasNext: results?.data?.next_page,
        currentPage: page,
        itemPerPage,
        total: Number(results?.data?.total),
        totalPages: Math.ceil(Number(results?.data?.total) / itemPerPage)
      }
    }),
    [
      results?.data?.data,
      results?.data?.total,
      results?.data?.next_page,
      isPending,
      error,
      refetch,
      handleChangePage,
      handleChangePageSize,
      page,
      itemPerPage
    ]
  );

  return memoizedValue;
}
// -------------------------journal voucher--------
export function useGetJournalVouchers({ status = 0, projectCode = 0, voucherNo = '', financialYear, limit = 10 }: any) {
  const { user_id, business_id } = getUserData();
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const queryParams = {
    u: user_id,
    b: business_id,
    offset: page,
    limit: limit,
    ...(status !== 0 && { status: status.toString() }),
    ...(projectCode !== 0 && { project_id: projectCode.toString() }),
    ...(voucherNo && { voucher_number: voucherNo }),
    ...(financialYear && { financial_year: financialYear.toString() })
  };
  const queryKey = `/main/serve/journal/voucher/?${new URLSearchParams(queryParams).toString()}`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
    //enabled: false
  });
  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);
  const handleChangePageSize = useCallback((size: number) => {
    setItemPerPage(size);
  }, []);
  const results = data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      vouchers: results?.data?.data,
      vouchersLoading: isPending,
      vouchersError: error,
      vouchersValidating: isPending,
      totalVouchers: results?.data?.total ?? 0,
      // hasNextPage: results?.next_page,
      refetch: refetch,
      handleChangePage,
      handleChangePageSize,
      meta: {
        hasNext: results?.data?.next_page,
        currentPage: page,
        itemPerPage,
        total: Number(results?.data?.total),
        totalPages: Math.ceil(Number(results?.data?.total) / itemPerPage)
      }
    }),
    [
      results?.data?.data,
      results?.data?.total,
      results?.data?.next_page,
      isPending,
      error,
      refetch,
      handleChangePage,
      handleChangePageSize,
      page,
      itemPerPage
    ]
  );

  return memoizedValue;
}

// --------------------DEBIT VOUCHER-----------------------
export function useGetDebitVouchers({ status = 0, projectCode = 0, voucherNo = '', financialYear, limit = 10 }: any) {
  const { business_id } = getUserData();
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const queryParams = {
    b: business_id,
    offset: page,
    limit: limit,
    ...(status !== 0 && status !== 4 && status !== 6 && { status: status.toString() }),
    ...(projectCode !== 0 && { project_id: projectCode.toString() }),
    ...(voucherNo && { voucher_number: voucherNo }),
    ...(status === 4 && { voucher_category_id: '2' }),
    ...(status === 6 && { voucher_category_id: '4' }),
    ...(financialYear && { financial_year: financialYear.toString() })
  };
  const queryKey = `/main/serve/debit/voucher/?${new URLSearchParams(queryParams).toString()}`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
    //enabled: false
  });
  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);
  const handleChangePageSize = useCallback((size: number) => {
    setItemPerPage(size);
  }, []);
  const results = data?.data ?? {};
  //console.log(results);

  const memoizedValue = useMemo(
    () => ({
      vouchers: results?.data?.data,
      vouchersLoading: isPending,
      vouchersError: error,
      vouchersValidating: isPending,
      totalVouchers: results?.data?.total ?? 0,
      // hasNextPage: results?.next_page,
      refetch: refetch,
      handleChangePage,
      handleChangePageSize,
      meta: {
        hasNext: results?.data?.next_page,
        currentPage: page,
        itemPerPage,
        total: Number(results?.data?.total),
        totalPages: Math.ceil(Number(results?.data?.total) / itemPerPage)
      }
    }),
    [
      results?.data?.data,
      results?.data?.total,
      results?.data?.next_page,
      isPending,
      error,
      refetch,
      handleChangePage,
      handleChangePageSize,
      page,
      itemPerPage
    ]
  );

  return memoizedValue;
}
// ---------------GET BANK DETAILS---------------------------------
export const useGetBankDetails = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`main/serve/bank/letter/details/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    getBankDetails: mutateAsync
  };
};
// -------------------GENEATE PDF-------------------
export const useGeneratePdf = (onSuccess = (data: any) => { }, onError = (error: any) => { }) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`main/generate/pdf/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError
  });
  return {
    data,
    isLoading: isPending,
    getGeneratePdf: mutateAsync
  };
};
// -------------------------VIEW ADVANCE LIST--------------------------
export function useGetViewAdvanceList({ status = 0, projectCode = 0, voucherNo = '', page = 1, limit = 10 }: any) {
  const { business_id } = getUserData();
  const queryParams = {
    b: business_id,
    offset: page,
    limit: limit,
    ...(status !== 0 && { status: status.toString() }),
    ...(projectCode !== 0 && { project_id: projectCode.toString() }),
    ...(voucherNo && { voucher_number: voucherNo })
    // ...(financialYear && { financial_year: financialYear.toString() })
  };
  const queryKey = `/main/serve/advance-management/voucher/?${new URLSearchParams(queryParams).toString()}`;
  const { data, refetch, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
    //enabled: false
  });
  const results = data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      advance: results?.data?.data,
      advanceLoading: isPending,
      advanceError: error,
      advanceValidating: isPending,
      totalAdvance: results?.total ?? 0,
      hasNextPage: results?.next_page,
      refetch: refetch
    }),
    [results?.data?.data, results?.total, results?.next_page, isPending, error, refetch]
  );

  return memoizedValue;
}
// -------------------------VIEW ADVANCE DETAIL LIST--------------------------
export function useGetViewAdvanceDetailList(voucherNo: any) {
  const { business_id } = getUserData();
  const queryParams = {
    b: business_id,
    ...(voucherNo && { voucher_id: voucherNo })
  };
  const queryKey = `/main/serve/advance-management/voucher/details/?${new URLSearchParams(queryParams).toString()}`;
  const { data, isPending, error } = useQuery({
    queryKey: [queryKey, queryParams.toString()],
    queryFn: () => axiosServices.get(queryKey)
    //enabled: false
  });
  const results = data?.data ?? {};
  const memoizedValue = useMemo(
    () => ({
      advanceDetails: results?.data,
      advanceDetailsLoading: isPending,
      advanceDetailsError: error,
      advanceDetailsValidating: isPending
      //totalAdvance: results?.total ?? 0,
      // hasNextPage: results?.next_page,
      // refetch: refetch
    }),
    [results?.data, isPending, error]
  );

  return memoizedValue;
}

export function useGetInternalLoan(filters?: any) {
  const { business_id } = getUserData();
  const [page, setPage] = useState(1);
  const itemPerPage = 10;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchParams = new URLSearchParams({
    b: String(business_id),
    offset: String(page),
    limit: String(itemPerPage),
    ...(filters ? { project_id: String(filters) } : {})
    // project_id: String(filters)
  });

  const listQuery = useMemo(() => `/main/serve/internal-loan/voucher/?${searchParams.toString()}`, [searchParams]);

  const { data, isFetching, isLoading, isPlaceholderData, error, refetch } = useQuery({
    queryKey: [listQuery],
    queryFn: () => axiosServices.get(listQuery),
    select: (data) => data?.data?.data,
    enabled: page > 0,
    refetchOnMount: false,//need
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData
  });

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  useCallback(() => {
    if (error) {
      alert(JSON.stringify(error));
    }
  }, [error]);

  const memoizedValue = useMemo(
    () => ({
      internalLoans: data?.data as InternalLoanList[],
      isLoading: (isPlaceholderData && isFetching) || isLoading,
      handleChangePage,
      refetch: refetch,
      meta: {
        hasNext: data?.next_page,
        currentPage: page,
        itemPerPage,
        total: Number(data?.total),
        totalPages: Math.ceil(Number(data?.total) / itemPerPage)
      }
    }),
    [data?.data, data?.next_page, data?.total, isPlaceholderData, isFetching, isLoading, handleChangePage, page]
  );

  return memoizedValue;
}

export function useGetViewAdvance(filters?: FilterInitialValues) {
  const [page, setPage] = useState(1);
  const itemPerPage = 10;
  const { business_id } = getUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchParams = new URLSearchParams({
    b: String(business_id),
    offset: String(page),
    limit: String(itemPerPage),
    ...(Object.keys(filters ?? {}).length > 0
      ? {
        ...(filters?.projectCode ? { project_id: String(filters.projectCode) } : {}),
        ...(filters?.status ? { status: String(filters.status) } : {}),
        ...(filters?.voucherNo ? { voucher_number: String(filters.voucherNo) } : {})
      }
      : {})
  });

  const listQuery = useMemo(() => `/main/serve/advance-management/voucher/?${searchParams.toString()}`, [searchParams]);

  const { data, isFetching, isLoading, isPlaceholderData, error, refetch } = useQuery({
    queryKey: [listQuery],
    queryFn: () => axiosServices.get(listQuery),
    select: (data) => data?.data?.data,
    enabled: page > 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData
  });

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  useCallback(() => {
    if (error) {
      // alert(JSON.stringify(error));
    }
  }, [error]);

  const memoizedValue = useMemo(
    () => ({
      viewAdvanceList: data?.data as ViewAdvanceList[],
      isLoading: (isPlaceholderData && isFetching) || isLoading,
      handleChangePage,
      meta: {
        hasNext: data?.next_page,
        currentPage: page,
        itemPerPage,
        total: Number(data?.total),
        totalPages: Math.ceil(Number(data?.total) / itemPerPage)
      },
      getAdvanceLists: refetch
    }),
    [data?.data, data?.next_page, data?.total, isPlaceholderData, isFetching, isLoading, handleChangePage, page, refetch]
  );

  return memoizedValue;
}

export function useGetViewAdvanceDetails() {
  const { business_id } = getUserData();
  const staticPayload = {
    b: business_id
  };
  const { data, isPending, mutateAsync } = useMutation({
    mutationKey: [`/main/serve/advance-management/voucher/details/`],
    mutationFn: async (payload: any) =>
      axiosServices.get(buildUrlWithParams(`/main/serve/advance-management/voucher/details/`, { ...staticPayload, ...payload }))
  });

  const memoizedValue = useMemo(
    () => ({
      advanceDetail: data?.data?.data[0] as ViewAdvanceDetail,
      isLoading: isPending,
      getAdvanceDetail: mutateAsync
    }),
    [data?.data, isPending, mutateAsync]
  );

  return memoizedValue;
}
export function useGetInternalLoanDetails() {
  const { business_id } = getUserData();
  const staticPayload = {
    b: business_id
  };
  const { data, isPending, mutateAsync } = useMutation({
    mutationKey: [`/main/serve/internal-loan/voucher/details/`],
    mutationFn: async (payload: any) =>
      axiosServices.get(buildUrlWithParams(`/main/serve/internal-loan/voucher/details/`, { ...staticPayload, ...payload }))
  });

  const memoizedValue = useMemo(
    () => ({
      loanDetail: data?.data?.data[0] as InternalLoanDetail,
      isLoading: isPending,
      getLoanDetail: mutateAsync
    }),
    [data?.data, isPending, mutateAsync]
  );

  return memoizedValue;
}

export const useUpdateSubProject = () => {
  const { user_id } = getUserData();
  const staticPayload = {
    user_id
  };
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.put(`/main/update/sub-project/`, { ...staticPayload, ...payload })
  });
  return {
    data,
    isLoading: isPending,
    updateSubProject: mutateAsync
  };
};

export const useSettleInternalLoan = () => {
  const { business_id, user_id } = getUserData();
  const staticPayload = {
    business_id,
    user_id
  };
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/create/repay/internal-loan/voucher/`, { ...staticPayload, ...payload })
  });
  return {
    data,
    isLoading: isPending,
    settleInternalLoan: mutateAsync
  };
};

export const useSettleAdvanceManagement = () => {
  const { business_id, user_id } = getUserData();
  const staticPayload = {
    business_id,
    user_id
  };
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/main/settle/advance-management/voucher/`, { ...staticPayload, ...payload })
  });
  return {
    data,
    isLoading: isPending,
    settleAdvanceManagement: mutateAsync
  };
};

export const useGetOwnBankAccounts = () => {
  const key = `/main/serve/own_account/bank/`; // API endpoint

  const { isLoading, data } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await axiosServices.get(key);
      return response.data; // Extract the response data
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  // Format the data for Autocomplete
  const formattedData = useMemo(() => {
    return (data?.data ?? []).map((item: any) => ({
      value: item.id, // Use bank ID as value
      label: item.bank_name // Use bank name as label
    }));
  }, [data?.data]);

  return {
    bankListData: formattedData,
    loading: isLoading
  };
};