import useSWR, { mutate } from "swr";
import { useCallback, useMemo, useState } from "react";

// utils
import axiosServices, { fetcher } from "utils/axios";

// types
import {
  ProjectLedgerList,
  ProjectList,
  ProjectProps,
  TotalProjectInternalLoan,
} from "types/project";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { IFilterInitialValues } from "pages/projects/utils";
import { getUserData } from "contexts/AuthContext";
const initialState: ProjectProps = {
  modal: false,
};

export const endpoints = {
  key: "/main/serve/",
  modal: "/modal", // server URL
  insert: "/insert", // server URL
  update: "/update", // server URL
  delete: "/delete", // server URL
};

export function useGetProject(filters?: IFilterInitialValues) {
  const { business_id, user_id, is_executive } = getUserData();
  const [page, setPage] = useState(1);
  const itemPerPage = 9;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchParams = new URLSearchParams({
    u: String(user_id),
    b: String(business_id),
    executive: String(is_executive),
    offset: String(page),
    limit: String(itemPerPage),
    is_active: String(Boolean(filters?.isActive ?? true)),
    ...(Object.keys(filters ?? {}).length > 0
      ? {
          main_master_project: String(filters!.isMasterProject),
          ...(filters!.projectIds && filters!.projectIds.length > 0
            ? { project_ids: JSON.stringify(filters?.projectIds) }
            : {}),
        }
      : {}),
  });

  const listQuery = useMemo(
    () => `project/?${searchParams.toString()}`,
    [searchParams]
  );

  const { data, isFetching, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: [endpoints.key, listQuery],
    queryFn: () => fetcher(endpoints.key + listQuery),
    select: (data) => data?.data,
    enabled: page > 0,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
    placeholderData: keepPreviousData,
  });

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      projects: data?.data as ProjectList[],
      isLoading: (isPlaceholderData && isFetching) || isLoading,
      handleChangePage,
      refetch,
      meta: {
        hasNext: data?.next_page,
        currentPage: page,
        itemPerPage,
        total: Number(data?.total),
        totalPages: Math.ceil(Number(data?.total) / itemPerPage),
      },
    }),
    [
      data?.data,
      data?.next_page,
      data?.total,
      isPlaceholderData,
      isFetching,
      isLoading,
      handleChangePage,
      page,
      refetch,
    ]
  );

  return memoizedValue;
}

export const useGetProjectDetail = (projectId: number = 0) => {
  const { business_id } = getUserData();
  const { isLoading, data, refetch } = useQuery({
    queryKey: [`/main/serve/vendor/?b=${business_id}&id=${projectId}`],
    queryFn: async () =>
      axiosServices.get(
        `/main/serve/project/details/?b=${business_id}&id=${projectId}`
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    project: data?.data?.data[0] ?? {},
    loading: isLoading,
    refetch,
  };
};
export const useGetProjectFinancialYear = (projectId: number = 0) => {
  const { business_id } = getUserData();
  const { isLoading, data } = useQuery({
    queryKey: [
      `/main/serve/project/financial/year/?b=${business_id}&project_id=${projectId}`,
    ],
    queryFn: async () =>
      axiosServices.get(
        `/main/serve/project/financial/year/?b=${business_id}&project_id=${projectId}`
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const formattedData = useMemo(() => {
    return [...(data?.data?.data ?? [])].map((item: any) => ({
      label: item["financial_year"],
      value: item["id"],
    }));
  }, [data?.data]);

  return {
    financialYears: formattedData,
    loading: isLoading,
  };
};

export const useGetProjectList = () => {
  const { business_id, user_id, is_executive } = getUserData();
  const key = `/main/serve/project/list/?u=${user_id}&b=${business_id}&executive=${is_executive}&is_draft=true`;
  const { isLoading, data, refetch } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key),
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
    refetchOnReconnect: "always",
  });

  const formattedData = useMemo(() => {
    return [...(data?.data?.data || [])].map((item: any) => ({
      label: item["project_code"],
      value: item["id"],
    }));
  }, [data?.data?.data]);

  return {
    projects: formattedData,
    loading: isLoading,
    refetch: refetch,
  };
};
export const useGetAccessTypes = () => {
  const key = `/main/serve/access/type/`;
  const { isLoading, data } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const formattedData = useMemo(() => {
    return [...(data?.data?.data || [])].map((item: any) => ({
      label: item["name"],
      value: item["id"],
    }));
  }, [data?.data?.data]);

  return {
    accessTypes: formattedData,
    loading: isLoading,
  };
};

export function useGetProjectLedgersByFinancialYear(payload: {
  projectId: number;
  financialYear: number | null;
  fromDate: string | null;
  toDate: string | null;
}) {
  const { business_id } = getUserData();
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchParams = new URLSearchParams({
    b: String(business_id),
    offset: String(page),
    limit: String(itemPerPage),
    project_financial_year: String(payload.financialYear),
    from_date: String(payload.fromDate),
    to_date: String(payload.toDate),
    project_id: String(payload.projectId),
  });

  const listQuery = useMemo(
    () => `/main/serve/project/ledgers/?${searchParams.toString()}`,
    [searchParams]
  );

  const { data, isFetching, isLoading, isPlaceholderData } = useQuery({
    queryKey: [listQuery],
    queryFn: () => axiosServices.get(`${listQuery}`),
    select: (data) => data?.data,
    enabled: page > 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);
  const handleChangePageSize = useCallback((size: number) => {
    setItemPerPage(size);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      ledgers: data?.data as ProjectLedgerList[],
      isLoading: (isPlaceholderData && isFetching) || isLoading,
      handleChangePage,
      handleChangePageSize,
      meta: {
        hasNext: data?.next_page,
        currentPage: page,
        itemPerPage,
        total: Number(data?.total),
        totalPages: Math.ceil(Number(data?.total) / itemPerPage),
      },
    }),
    [
      data?.data,
      data?.next_page,
      data?.total,
      isPlaceholderData,
      isFetching,
      isLoading,
      handleChangePage,
      handleChangePageSize,
      page,
      itemPerPage,
    ]
  );

  return memoizedValue;
}

export async function insertProject(newProject: ProjectList) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentProject: any) => {
      newProject.id = currentProject.projects.length + 1;
      const addedProject: ProjectList[] = [
        ...currentProject.projects,
        newProject,
      ];

      return {
        ...currentProject,
        projects: addedProject,
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { newProject };
  //   await axios.post(endpoints.key + endpoints.insert, data);
}

export async function updateProject(
  projectId: number,
  updatedProject: ProjectList
) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentProject: any) => {
      const newProject: ProjectList[] = currentProject.projects.map(
        (project: ProjectList) =>
          project.id === projectId ? { ...project, ...updatedProject } : project
      );

      return {
        ...currentProject,
        projects: newProject,
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { list: updatedProject };
  //   await axios.post(endpoints.key + endpoints.update, data);
}

export async function deleteProject(projectId: number) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentProject: any) => {
      const nonDeletedProject = currentProject.projects.filter(
        (project: ProjectList) => project.id !== projectId
      );

      return {
        ...currentProject,
        projects: nonDeletedProject,
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { projectId };
  //   await axios.post(endpoints.key + endpoints.delete, data);
}

export function useGetProjectMaster() {
  const { data, isLoading } = useSWR(
    endpoints.key + endpoints.modal,
    () => initialState,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      projectMaster: data,
      projectMasterLoading: isLoading,
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerProjectDialog(modal: boolean) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.modal,
    (currentProjectmaster: any) => {
      return { ...currentProjectmaster, modal };
    },
    false
  );
}

export const useCreateProject = (
  onSuccess = (data: any) => {},
  onError = (error: any) => {}
) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      axiosServices.post(`main/create/project/`, payload),
    onSuccess: (data) => onSuccess(data?.data),
    onError: onError,
  });
  return {
    data,
    isLoading: isPending,
    createProject: mutateAsync,
  };
};

export const useGetSubProjectList = (projectId: number) => {
  const key = `/main/serve/sub-project/?master_project_id=${projectId}`;
  const { isLoading, data, refetch, isRefetching } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key),
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!projectId,
  });
  return {
    subProjects: data?.data?.data ?? [],
    loading: isLoading || isRefetching,
    refetch,
  };
};
export const useGetProjectRoles = (projectId: number) => {
  const key = `main/serve/project-role/?project_id=${projectId}`;
  const { isLoading, data, refetch, isRefetching } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key),
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!projectId,
  });
  return {
    projectRoles: data?.data?.data ?? [],
    isLoading: isLoading || isRefetching,
    refetch,
  };
};

export const useGetProjectInternalLoan = (projectId: number) => {
  const { business_id } = getUserData();
  const key = `main/serve/project/internal-loan/voucher/details/?b=${business_id}&project_id=${projectId}`;
  const { isLoading, data, refetch, isRefetching } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key),
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!projectId,
  });
  const loanData = data?.data?.data ?? [];

  return {
    loanData: loanData?.voucher_serialized_data,
    loanDashboard: (loanData?.loan_obj as TotalProjectInternalLoan[]) || [],
    isLoading: isLoading || isRefetching,
    refetch,
  };
};

export const useGetAccountHead = (
  projectId: number,
  projectFinancialYearId: string
) => {
  const key =
    projectId && projectFinancialYearId !== null
      ? `main/get/account/head/wise/expense?project_id=${projectId}&project_financial_year_id=${projectFinancialYearId}`
      : null;

  const { isLoading, data, refetch } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key!),
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: !!projectId && projectFinancialYearId !== null,
  });

  const accountHeadData = data?.data?.data ?? [];
  return {
    accountHeadData,
    isLoading,
    refetch,
  };
};

export const useUpdateSubProject = () => {
  const { user_id } = getUserData();
  const staticPayload = {
    // business_id,
    user_id,
  };
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      axiosServices.put(`/main/update/sub-project/`, {
        ...staticPayload,
        ...payload,
      }),
  });
  return {
    data,
    isLoading: isPending,
    updateSubProject: mutateAsync,
  };
};

export const useUpdateProjectPI = (projectId: number) => {
  const { user_id } = getUserData();
  const staticPayload = {
    user_id,
    project_id: projectId,
  };
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      axiosServices.put(`/main/update/project-role/`, {
        ...staticPayload,
        ...payload,
      }),
  });
  return {
    data,
    isLoading: isPending,
    updateProjectPi: mutateAsync,
  };
};

export const useAddProjectRole = (projectId: number) => {
  const { user_id } = getUserData();
  const staticPayload = {
    user_id,
    project_id: projectId,
  };
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      axiosServices.post(`/main/add/project-role/`, {
        ...staticPayload,
        ...payload,
      }),
  });
  return {
    data,
    isLoading: isPending,
    addProjectRole: mutateAsync,
  };
};
export const useDeleteProjectRole = (employeeId: number) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      axiosServices.delete(`/main/delete/project-role/?id=${employeeId}`),
  });
  return {
    data,
    isLoading: isPending,
    deleteProjectRole: mutateAsync,
  };
};

export const useUpdateProjectRole = (payload: {
  id: number;
  project_id: number;
  access_type_id: number;
  employee_id: number;
}) => {
  const { user_id } = getUserData();
  const staticPayload = {
    user_id,
    ...payload,
  };
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      axiosServices.put(`/main/retired/project-role/`, staticPayload),
  });
  return {
    data,
    isLoading: isPending,
    retireProjectRole: mutateAsync,
  };
};

export const useUpdateProjectExtension = () => {
  const { business_id, user_id } = getUserData();
  const staticPayload = {
    business_id,
    user_id,
  };
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      axiosServices.post(`/main/create/project-extension/`, {
        ...staticPayload,
        ...payload,
      }),
  });
  return {
    data,
    isLoading: isPending,
    updateProjectExstension: mutateAsync,
  };
};

const getConsolidatedData = (data: { [key: string]: any }[] = []) => {
  // Use a more efficient `reduce` approach to directly accumulate sums
  const consolidatedData = data.reduce((acc, item) => {
    Object.entries(item).forEach(([key, value]) => {
      if (key.startsWith("FY")) {
        acc[key] = (acc[key] || 0) + parseFloat(value);
      }
    });
    return acc;
  }, {});
  consolidatedData.total_amount = Object.values(consolidatedData).reduce(
    (sum, value) => sum + value,
    0
  );
  consolidatedData.totalRow = true;
  return consolidatedData;
};
export const useGetProjectBudgetList = (projectId: number) => {
  const key = `/main/serve/project-budget/?project_id=${projectId}`;
  const { isLoading, data, refetch, isRefetching } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!projectId,
  });

  const projectSplits = useMemo(
    () => data?.data?.data ?? [],
    [data?.data?.data]
  );
  if (projectSplits.length > 0) {
  }

  const formatedData = useMemo(() => projectSplits, [projectSplits]);
  if (formatedData.length > 0) {
    const totalData = getConsolidatedData(formatedData);
    formatedData.push(totalData);
  }

  return {
    projectBudgets: formatedData ?? [],
    loading: isLoading || isRefetching,
    refetch,
  };
};

export const useCreateProjectBudget = () => {
  const { business_id, user_id } = getUserData();
  const staticPayload = {
    business_id,
    user_id,
  };
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      axiosServices.post(`/main/create/project-budget/`, {
        ...staticPayload,
        ...payload,
      }),
  });
  return {
    data,
    isLoading: isPending,
    createProjectBudget: mutateAsync,
  };
};
export const useUpdateProjectCompletedStatus = (projectId: number) => {
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      axiosServices.put(`/main/move/to/completed/project`, { id: projectId }),
  });
  return {
    data: data?.data,
    isLoading: isPending,
    updateProjectComplete: mutateAsync,
  };
};

export const userprojectupload = (projectId: number) => {
  const key = `/main/get/project/documents?project_id=${projectId}`;
  const { isLoading, data, refetch, isRefetching } = useQuery({
    queryKey: [key],
    queryFn: async () => axiosServices.get(key),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!projectId,
  });

  return {
    // projectBudgets: formatedData ?? [],
    data: data?.data,
    loading: isLoading || isRefetching,
    refetch,
  };
};

// export const useCreateProjectUpload = () => {
//   const { business_id, user_id } = getUserData();
//   const staticPayload = {
//     business_id,
//     user_id
//   };
//   const { data, mutateAsync, isPending } = useMutation({
//     mutationFn: async (payload: any) => axiosServices.post(`/main/upload/project/documents`, { ...staticPayload, ...payload })
//   });
//   return {
//     data,
//     isLoading: isPending,
//     updateProjectExstension: mutateAsync
//   };
// };

export const useCreateProjectUpload = () => {
  const { business_id, user_id } = getUserData();
  const staticPayload = {
    business_id,
    user_id,
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      try {
        const response = await axiosServices.post(
          "/main/upload/project/documents",
          { ...staticPayload, ...payload }
        );
        return response;
      } catch (error) {
        console.error("API call error:", error);
        throw error;
      }
    },
  });

  return {
    updateProjectExstension: mutateAsync,
    isLoading: isPending,
  };
};
