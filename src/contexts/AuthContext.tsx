/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useReducer } from 'react';
// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';
import storage from 'utils/storage';
// project import
import Loader from 'components/Loader';
import axiosInstance, { axiosAuthServices } from 'utils/axios';
import { AuthProps, AuthContextType, UserProfile, UserModuleResponseType } from 'types/auth';
import { LoginResponse } from './types';
import { useGetUserModules } from 'api/auth';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';

// console.log(import.meta.env.VITE_APP_API_URL);

// constant
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

interface SessionTYpe {
  serviceToken?: string | null;
  user?: UserProfile | null;
  accessModules?: UserModuleResponseType;
}

const setSession = ({ serviceToken, user, accessModules }: SessionTYpe) => {
  if (serviceToken) {
    storage.setItem('serviceToken', serviceToken);
    storage.setItem('user', user);
    storage.setItem('userModules', accessModules);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    storage.removeItem('serviceToken');
    storage.removeItem('user');
    storage.removeItem('userModules');
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

export const getUserData = (): UserProfile => {
  return (storage.getItem('user') || {}) as UserProfile;
};

// ==============================|| AUTH CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { mutate: getUserModules } = useGetUserModules(state?.user ?? {});
  useEffect(() => {
    const init = async () => {
      try {
        const user = storage.getItem('user');
        const serviceToken = storage.getItem('serviceToken');
        const accessModules = storage.getItem('userModules');
        if (user) {
          setSession({ serviceToken, user: user, accessModules });
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: user
            }
          });
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (state.user) {
      getUserModules();
    }
    return () => {};
  }, [state.user]);

  const login = async (username: string, password: string, application_id: string) => {
    try {
      const response = await axiosAuthServices.post(`/user/signin/`, { username, password, application_id });
      const { token: serviceToken, access_module, ...user }: LoginResponse = response.data;
      setSession({ serviceToken, user, accessModules: access_module });
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });
    } catch (error: any | { detail: string }) {
      let errorMessage: string = '';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        if (error.detail) {
          errorMessage = error.detail;
        }
      }
      if (errorMessage) {
        openSnackbar({
          open: true,
          message: errorMessage,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'error'
          }
        } as SnackbarProps);
      }
    }
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
    storage.clear();
  };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
