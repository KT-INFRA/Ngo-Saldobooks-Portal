import { useMemo } from 'react';

// utils
import axiosServices from 'utils/axios';

import { getUserData } from 'contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
// interface QueryResponse<T> {
//     data: {
//         data: T[];
//     };
// }

// interface Item {
//     [key: string]: any;
// }

// export const endpoints = {
//     key: 'main/get',
//     spending: '/account/head/wise/spending',
//     insert: '/new',
//     update: '/edit',
//     delete: '/delete'
// };

// const useQueryData = <T extends Item>(
//     queryKey: string[],
//     queryFn: () => Promise<QueryResponse<T>>,
//     labelKey: string = 'name',
//     valueKey: string = 'id'
// ) => {
//     const { isLoading, data } = useQuery({
//         queryKey,
//         queryFn,
//         refetchOnWindowFocus: false,
//         refetchOnMount: false,
//         refetchOnReconnect: false
//     });
//     const formattedData = useMemo(() => {
//         return [...(data?.data?.data || [])].map((item: any) => ({
//             label: item[labelKey],
//             value: item[valueKey]
//         }));
//     }, [data?.data?.data, labelKey, valueKey]);

//     return {
//         data: formattedData,
//         loading: isLoading
//     };
// };

// export const useGetAccSpending = () => {
//     const { business_id, user_id, is_executive } = getUserData();
//     const { data, isLoading, error, isFetching } = useQuery({
//         queryKey: [endpoints.key + endpoints.spending + `?u=${user_id}&is_executive=${is_executive}&b=${business_id}`],
//         queryFn: async () => axiosServices.get(endpoints.key + endpoints.spending + `?u=${user_id}&is_executive=${is_executive}&b=${business_id}`),
//         refetchOnWindowFocus: false,
//         refetchOnMount: false,
//         refetchOnReconnect: false
//     });
//     console.log(data?.data);
//     const memoizedValue = useMemo(
//         () => ({
//             spendings: data?.data?.data,
//             spendingsLoading: isLoading,
//             spendingsError: error,
//             spendingsValidating: isFetching,
//             spendingsEmpty: !isLoading && !data?.data?.data.length,
//         }),
//         [
//             data?.data?.data,
//             error,
//             isFetching,
//             isLoading,
//         ]
//     )
//     return memoizedValue
// }

export const useGetApprovedBudgets = () => {
    const { business_id, user_id, is_executive } = getUserData();
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: [`/main/get/approved/budget?u=${user_id}&is_executive=${is_executive}&b=${business_id}`],
        queryFn: async () => axiosServices.get(`/main/get/approved/budget?u=${user_id}&is_executive=${is_executive}&b=${business_id}`),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
    const budgets = data?.data?.data;
    const aicrpTotal = budgets?.filter((item: any) => item.project_group_name === "AICRP Projects").reduce((acc: any, current: any) => acc + current.total_amount, 0);
    const eapTotal = budgets?.filter((item: any) => item.project_group_name === "EAP Projects").reduce((acc: any, current: any) => acc + current.total_amount, 0);
    const memoizedValue = useMemo(
        () => ({
            approvedBudgets: data?.data?.data,
            aicrpTotal: aicrpTotal,
            eapTotal: eapTotal,
            approvedBudgetsLoading: isLoading,
            approvedBudgetsError: error,
            approvedBudgetsValidating: isFetching,
            approvedBudgetsEmpty: !isLoading && !data?.data?.data.length,
        }),
        [aicrpTotal, data?.data?.data, eapTotal, error, isFetching, isLoading]
    )
    return memoizedValue
}

export const useGetProjectCount = () => {
    const { business_id, user_id, is_executive } = getUserData();
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: [`/main/get/active/project/count?u=${user_id}&is_executive=${is_executive}&b=${business_id}`],
        queryFn: async () => axiosServices.get(`/main/get/active/project/count?u=${user_id}&is_executive=${is_executive}&b=${business_id}`),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
    const budgets = data?.data?.data;
    const aicrpTotal = budgets?.find((item: any) => item.project_group_name === "AICRP Projects").count
    const eapTotal = budgets?.find((item: any) => item.project_group_name === "EAP Projects").count

    const memoizedValue = useMemo(
        () => ({
            projectCount: data?.data?.data,
            aicrpTotal: aicrpTotal,
            eapTotal: eapTotal,
            projectCountLoading: isLoading,
            projectCountError: error,
            projectCountValidating: isFetching,
            projectCountEmpty: !isLoading && !data?.data?.data.length,
        }),
        [aicrpTotal, data?.data?.data, eapTotal, error, isFetching, isLoading]
    )
    return memoizedValue
}

export const useGetFundingAgenciesFunds = () => {
    const { business_id, user_id, is_executive } = getUserData();
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: [`/main/get/funds/from/funding/agencies?u=${user_id}&is_executive=${is_executive}&b=${business_id}`],
        queryFn: async () => axiosServices.get(`/main/get/funds/from/funding/agencies?u=${user_id}&is_executive=${is_executive}&b=${business_id}`),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
    const memoizedValue = useMemo(
        () => ({
            funds: data?.data?.data,
            fundsLoading: isLoading,
            fundsError: error,
            fundsValidating: isFetching,
            fundsEmpty: !isLoading && !data?.data?.data.length,
        }),
        [
            data?.data?.data,
            error,
            isFetching,
            isLoading,
        ]
    )
    return memoizedValue
}

export const useGetLoanProviders = () => {
    const { business_id, user_id, is_executive } = getUserData();
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: [`/main/get/loan/providers?u=${user_id}&is_executive=${is_executive}&b=${business_id}`],
        queryFn: async () => axiosServices.get(`/main/get/loan/providers?u=${user_id}&is_executive=${is_executive}&b=${business_id}`),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
    const memoizedValue = useMemo(
        () => ({
            loanProviders: data?.data?.data,
            loanProvidersLoading: isLoading,
            loanProvidersError: error,
            loanProvidersValidating: isFetching,
            loanProvidersEmpty: !isLoading && !data?.data?.data.length,
        }),
        [
            data?.data?.data,
            error,
            isFetching,
            isLoading,
        ]
    )
    return memoizedValue
}

export const useGetAdvAndSettled = () => {
    const { business_id, user_id, is_executive } = getUserData();
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: [`/main/get/advance/settle/voucher/count?u=${user_id}&is_executive=${is_executive}&b=${business_id}`],
        queryFn: async () => axiosServices.get(`/main/get/advance/settle/voucher/count?u=${user_id}&is_executive=${is_executive}&b=${business_id}`),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
    const memoizedValue = useMemo(
        () => ({
            advNSettled: data?.data?.data,
            advNSettledLoading: isLoading,
            advNSettledError: error,
            advNSettledValidating: isFetching,
            advNSettledEmpty: !isLoading && !data?.data?.data.length,
        }),
        [
            data?.data?.data,
            error,
            isFetching,
            isLoading,
        ]
    )
    return memoizedValue
}

export const useGetVoucherType = () => {
    const { business_id, user_id, is_executive } = getUserData();
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: [`/main/get/month/wise/voucher/type/voucher/count?u=${user_id}&is_executive=${is_executive}&b=${business_id}`],
        queryFn: async () => axiosServices.get(`/main/get/month/wise/voucher/type/voucher/count?u=${user_id}&is_executive=${is_executive}&b=${business_id}`),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
    const memoizedValue = useMemo(
        () => ({
            voucherType: data?.data?.data,
            voucherTypeLoading: isLoading,
            voucherTypeError: error,
            voucherTypeValidating: isFetching,
            voucherTypeEmpty: !isLoading && !data?.data?.data.length,
        }),
        [
            data?.data?.data,
            error,
            isFetching,
            isLoading,
        ]
    )
    return memoizedValue
}

export const useGetVoucherStatus = () => {
    const { business_id, user_id, is_executive } = getUserData();
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: [`/main/get/month/wise/voucher/status/voucher/count?u=${user_id}&is_executive=${is_executive}&b=${business_id}`],
        queryFn: async () => axiosServices.get(`/main/get/month/wise/voucher/status/voucher/count?u=${user_id}&is_executive=${is_executive}&b=${business_id}`),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
    const memoizedValue = useMemo(
        () => ({
            voucherStatus: data?.data?.data,
            voucherStatusLoading: isLoading,
            voucherStatusError: error,
            voucherStatusValidating: isFetching,
            voucherStatusEmpty: !isLoading && !data?.data?.data.length,
        }),
        [
            data?.data?.data,
            error,
            isFetching,
            isLoading,
        ]
    )
    return memoizedValue
}

export const useGetProjectWiseFunds = () => {
    const { business_id, user_id, is_executive } = getUserData();
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: [`main/get/project/wise/fund/management?u=${user_id}&is_executive=${is_executive}&b=${business_id}`],
        queryFn: async () => axiosServices.get(`main/get/project/wise/fund/management?u=${user_id}&is_executive=${is_executive}&b=${business_id}`),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
    const memoizedValue = useMemo(
        () => ({
            projectFunds: data?.data?.data,
            projectFundsLoading: isLoading,
            projectFundsError: error,
            projectFundsValidating: isFetching,
            projectFundsEmpty: !isLoading && !data?.data?.data.length,
        }),
        [
            data?.data?.data,
            error,
            isFetching,
            isLoading,
        ]
    )
    return memoizedValue
}