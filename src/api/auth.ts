import { useMutation } from '@tanstack/react-query';
import { signal } from '@preact/signals-react';
import { useMemo } from 'react';
import { UserModule, UserModuleResponseType, UserProfile } from 'types/auth';
import { axiosAuthServices } from 'utils/axios';
import storage from 'utils/storage';
// import useBearStore from 'data/moduleStore';
export const useModuleSignal = signal<UserModule[]>([]);
export const useGetUserModules = (user: UserProfile) => {
  const userModulesQuery = useMemo(
    () =>
      `/user/serve/user-type/based/access/modules/?b=${user?.business_id}&a=${user?.application_id}&ut=${user?.user_type_id}&u=${user?.user_id}`,
    [user?.application_id, user?.business_id, user?.user_id, user?.user_type_id]
  );
  const { data, isPending, mutate, mutateAsync } = useMutation({
    mutationKey: [userModulesQuery],
    mutationFn: async () => await axiosAuthServices.get<UserModuleResponseType>(userModulesQuery),
    onSuccess(data) {
      // useBearStore.getState().setModules(data?.data?.modules ?? []);
      useModuleSignal.value = data?.data?.modules ?? [];
      storage.setItem('userModules', data?.data);
      localStorage.setItem('userModules2', JSON.stringify(data?.data));
    }
  });
  return {
    mutate,
    mutateAsync,
    isLoading: isPending,
    userModules: data
  };
};
