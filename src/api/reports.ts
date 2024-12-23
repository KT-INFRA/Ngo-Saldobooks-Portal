import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserData } from 'contexts/AuthContext';
import { IReportLayoutChild } from 'data/reports';
import dayjs from 'dayjs';
import { IReportFormInitialValuesProps } from 'pages/reports/utils';
import { useMemo } from 'react';
import useDownloader from 'react-use-downloader';
import axiosServices from 'utils/axios';

export const buildUrlWithParams = (baseUrl: string, params: Record<string, any>): string => {
  const url = new URL(baseUrl, import.meta.env.VITE_APP_API_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
};
export const useGetProjectFinancialYear = (projectId = 0) => {
  const { business_id } = getUserData();
  const { isLoading, data } = useQuery({
    queryKey: [`/main/serve/project/financial/year/?b=${business_id}&project_id=${projectId}`],
    queryFn: async () => axiosServices.get(`/main/serve/project/financial/year/?b=${business_id}&project_id=${projectId}`),
    refetchOnWindowFocus: false,
    enabled: !!projectId,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      label: item['financial_year'],
      value: item['id']
    }));
  }, [data?.data]);

  return {
    financialYears: formattedData,
    loading: isLoading
  };
};

export const useDownloadReport = (values: IReportFormInitialValuesProps, report: IReportLayoutChild) => {
  const { business_id } = getUserData();
  const { download, isInProgress } = useDownloader();
  const payload = {
    business_id: business_id,

    // Add project_id if report hasProjectId is true
    ...(report?.hasProjectId && { project_id: values.projectId }),

    // Add project_financial_year_id if report hasFinancialYear is true
    ...(report?.hasFinancialYear && { project_financial_year_id: values.financialYear }),

    // Add from_month and month based on report hasMonth and hasMonthRange
    ...(report?.hasMonth && report.hasMonthRange ? { from_month: values.month } : { month: values.month }),

    // Add from_date and to_date if report hasDate is true
    ...(report?.hasDate && { from_date: values.fromDate, to_date: values.toDate }),

    // Add year if report hasYear is true
    ...(report?.hasYear && { year: values.year })
  };

  const { isPending, data, mutateAsync } = useMutation({
    mutationKey: [report?.endPoint, payload],
    mutationFn: async () => axiosServices.post(report?.endPoint, payload),
    onSuccess: (data) => {
      const responseData = data?.data;
      if (responseData?.result) {
        const base64String = data?.data?.data;
        const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64String}`;
        const extension = '.xlsx';
        var fileName = '';
        if (report?.key === 'my_payroll') {
          fileName = `PAYROLL_${dayjs()
            .month(values?.month - 1)
            .format('MMM')
            ?.toUpperCase()}_${values?.year}${extension}`;
        } else {
          fileName = `${report.key}_${Math.round(Math.random() * 9999).toString()}${extension}`;
        }
        download(dataUrl, fileName);
      }
    }
  });

  return {
    data: data?.data?.data,
    loading: isPending || isInProgress,
    isInProgress: isInProgress,
    mutateAsync
  };
};
