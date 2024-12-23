import { useMemo, useState } from 'react';

// utils
import { fetcher } from 'utils/axios';

// types
// import { ProjectList, ProjectProps } from 'types/project';
// import { ProjectList, ProjectProps } from '../types/project';
import { CreditvoucherList } from '../../src/types/customer';
import { useQuery } from '@tanstack/react-query';
import { UserProfile } from 'types/auth';
import storage from 'utils/storage';
const { business_id }: UserProfile = storage.getItem('user')! ?? {};

export const endpoints = {
  key: '/main/serve/credit/',
  list: `voucher/?b=${business_id}&offset=1&limit=10`, // server URL
  modal: '/modal', // server URL
  insert: '/insert', // server URL
  update: '/update', // server URL
  delete: '/delete' // server URL
};

// export function useGetProject(tabval :string) {
//   //alert('tabval'+tabval);
//   const [page, setPage] = useState(1);
//   const PER_PAGE = 10;

//   //const listQuery = useMemo(() => `voucher/?b=1&offset=${page}&limit=${PER_PAGE}`, [page, PER_PAGE]);

//   const listQuery = useMemo(() => {
//     let extraParams = '';
//     switch (parseInt(tabval)) {
//       case 1:
//         extraParams = '&status=1';
//         break;
//       case 2:
//         extraParams = '&status=2';
//         break;
//       case 3:
//         extraParams = '&status=5';
//         break;
//       case 4:
//         extraParams = '&voucher_category_id=2';
//         break;
//       default:
//         extraParams = '';
//     }
//     return `voucher/?b=1&offset=${page}&limit=${PER_PAGE}${extraParams}`;
//   }, [page, PER_PAGE, tabval]);

//   const { data, refetch, isLoading, error, isFetching, isPlaceholderData } = useQuery({
//     queryKey: [endpoints.key, listQuery],
//     queryFn: () => fetcher(endpoints.key + listQuery),
//     retry: 3,
//     retryDelay: 1000 * 3,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: false
//   });
// //console.log("after da");
// //console.log(endpoints.key + listQuery);
//   const memoizedValue = useMemo(
//     () => ({
//       projects: data?.data?.data as CreditvoucherList[],
//       projectsLoading: isLoading,
//       projectsError: error,
//       projectsValidating: isFetching,
//       projectsEmpty: !isLoading && !data?.projects?.length,
//       totalProjects: data?.total ?? 0,
//       hasNextPage: data?.next_page,
//       mutate: refetch,
//       isPlaceholderData,
//       page,
//       setPage,
//       PER_PAGE
//     }),
//     [
//       data?.data?.data,
//       data?.next_page,
//       data?.projects?.length,
//       data?.total,
//       error,
//       isFetching,
//       isLoading,
//       isPlaceholderData,
//       page,
//       refetch,
//       PER_PAGE
//     ]
//   );

//   return memoizedValue;
// }
export function useGetProjectFilter(selected_project_code?: string, selected_voucherNo?: string) {
  //alert(selected_project_code+","+selected_voucherNo);

  // const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // alert("before");
  const [fpage, setFPage] = useState(1);
  const listQuery = useMemo(() => {
    let extraParams = '';

    if (selected_project_code === '0') {
      extraParams = `&voucher_number=${selected_voucherNo}`;
    } else {
      extraParams = `&project_id=${selected_project_code}&voucher_number=${selected_voucherNo}`;
    }
    return `voucher/?b=1&offset=${fpage}&limit=${PER_PAGE}${extraParams}`;
  }, [fpage, PER_PAGE, selected_project_code, selected_voucherNo]);

  // alert(listQuery);
  // --------------------------------------
  // if(selected_project_code == '0'){
  //   const extraParams = `&voucher_number${selected_voucherNo}`;
  // }else{
  // const extraParams = `&project_id=${selected_project_code}&voucher_number${selected_voucherNo}`;
  // }

  const { data, refetch, isLoading, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: [endpoints.key, listQuery],
    queryFn: () => fetcher(endpoints.key + listQuery),
    retry: 3,
    retryDelay: 1000 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  //console.log("after da");
  //console.log(endpoints.key + listQuery);
  const memoizedValue = useMemo(
    () => ({
      projects: data?.data?.data as CreditvoucherList[],
      projectsLoading: isLoading,
      projectsError: error,
      projectsValidating: isFetching,
      projectsEmpty: !isLoading && !data?.projects?.length,
      totalProjects: data?.total ?? 0,
      hasNextPage: data?.next_page,
      mutate: refetch,
      isPlaceholderData,
      fpage,
      setFPage,
      PER_PAGE
    }),
    [
      data?.data?.data,
      data?.next_page,
      data?.projects?.length,
      data?.total,
      error,
      isFetching,
      isLoading,
      isPlaceholderData,
      fpage,
      refetch,
      PER_PAGE
    ]
  );

  return memoizedValue;
}
