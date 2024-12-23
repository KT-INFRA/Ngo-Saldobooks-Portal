import { useMutation, useQuery } from '@tanstack/react-query';
//import { GeneratePayBillResponse } from 'types/payroll';
import axiosServices from 'utils/axios';
import { openSnackbar } from './snackbar';
import { SnackbarProps } from 'types/snackbar';
import { jwtDecode } from 'jwt-decode';
import { getUserData } from 'contexts/AuthContext';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const buildUrlWithParams = (baseUrl: string, params: Record<string, any>): string => {
  const url = new URL(baseUrl, import.meta.env.VITE_APP_API_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
};

export const useValidatePayBill = () => {
  return useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/payroll/employee/validation/`, payload)
  });
};
export const useUploadPayBill = (onUpload = (percent: number) => {}) => {
  return useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/payroll/create/employee/payroll/excel/`, payload)
  });
};

export const useGetGeneratePayBill = (params: { year: number; month: number }) => {
  const staticParams = {
    b: 1
    // offset: 1,
    // limit: 20
  };
  const combinedParams = { ...staticParams, ...params };
  const response = useQuery({
    queryKey: ['payroll', combinedParams],
    queryFn: async (payload: any) => axiosServices.get(buildUrlWithParams(`/payroll/serve/employee/payroll/excel/`, combinedParams))
  });
  return {
    ...response,
    data: response?.data
  };
};

export interface PayBillData {
  id: number;
  year_month: string;
  designation: string;
}

export interface YearBasedData {
  title: string;
  data: PayBillData[];
}

const convertPayBillResponse = (data: PayBillData[] = []): YearBasedData[] => {
  return [...data].reduce((acc: YearBasedData[], item: PayBillData) => {
    const year = item.year_month.split('-')[1];
    const existingYearData = acc.find((yearData) => yearData.title === year);

    if (existingYearData) {
      existingYearData.data.push(item);
    } else {
      acc.push({
        title: year,
        data: [item]
      });
    }

    return acc;
  }, []);
};

export const useGetMyPayBill = () => {
  const { business_id, user_id } = getUserData();
  const staticParams = {
    b: business_id,
    offset: 1,
    limit: 20,
    u: user_id
  };
  const combinedParams = { ...staticParams };
  const { isLoading, data } = useQuery({
    queryKey: ['/payroll/serve/employee/pay-slip/month-year/', combinedParams],
    queryFn: async () => axiosServices.get(buildUrlWithParams(`/payroll/serve/employee/pay-slip/month-year/`, combinedParams))
  });
  const payslipData = convertPayBillResponse(!isLoading ? [...data?.data?.data] : []);
  return {
    data: payslipData,
    isLoading: isLoading
  };
};

export const useGetGeneratepayBill = () => {
  const { business_id, user_id } = getUserData();
  const staticPayload = {
    business_id,
    user_id
  };
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => axiosServices.post(`/payroll/generate/pay-slip/`, { ...staticPayload, ...payload })
  });
  return {
    data,
    isLoading: isPending,
    updateGeneratepaybill: mutateAsync
  };
};

export const useGetPaySlipPdfById = (id: number) => {
  const { business_id, user_id } = getUserData();
  const staticParams = {
    b: business_id,
    u: user_id,
    id: id
  };
  const combinedParams = { ...staticParams };
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['payroll/serve/employee/pay-slip/', combinedParams],
    enabled: !!id,
    queryFn: async () => axiosServices.get(buildUrlWithParams(`payroll/serve/employee/pay-slip/`, combinedParams))
  });
  const pdfData = data?.data;
  //  console.log('pdf api');
  //  console.log(pdfData);

  if (typeof pdfData === 'string') {
    openSnackbar({
      open: true,
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      message: 'No Pdf data found',
      variant: 'alert',
      alert: {
        color: 'error'
      }
    } as SnackbarProps);
  }
  let path = '';
  if (pdfData?.data?.encrypt_file) {
    path = jwtDecode<{ path: string }>(pdfData?.data?.encrypt_file).path;
  }
  return {
    pdfUrl: path,
    isLoading: isLoading,
    getPayslipPdf: refetch
  };
};
