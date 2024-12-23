import { ReactElement } from 'react';

// third-party
import firebase from 'firebase/compat/app';

// ==============================|| TYPES - AUTH  ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type UserProfile = {
  business_id?: number;
  application_id?: number;
  user_id?: number;
  prefix?: string;
  username?: string;
  user_first_name?: string;
  user_last_name?: string;
  user_type_id?: number;
  user_type_name?: string;
  is_executive?: boolean;
};

export interface AuthProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null;
  token?: string | null;
}

export interface AuthActionProps {
  type: string;
  payload?: AuthProps;
}

export type FirebaseContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => Promise<void>;
  login: () => void;
  firebaseRegister: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  firebaseEmailPasswordSignIn: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  firebaseGoogleSignIn: () => Promise<firebase.auth.UserCredential>;
  firebaseTwitterSignIn: () => Promise<firebase.auth.UserCredential>;
  firebaseFacebookSignIn: () => Promise<firebase.auth.UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};

export type AWSCognitoContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<unknown>;
  resetPassword: (verificationCode: string, newPassword: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
  codeVerification: (verificationCode: string) => Promise<any>;
  resendConfirmationCode: () => Promise<any>;
};

export interface InitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
}

export interface AuthDataProps {
  userId: string;
}

export type AuthContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => void;
  login: (email: string, password: string, application_id: string) => Promise<void>;
};

export type Auth0ContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => void;
  login: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};

export type UserModuleResponseType = {
  business: ModuleBusinessType;
  user: ModuleUserType;
  modules: UserModule[];
};

// const modules: UserModule[] = storage.getItem('userModules')?.modules
// export type UserModuleName = (typeof modules)[number]['module_name'];
// export type UserModuleId = (typeof modules)[number]['module_id'];

// export type UserSubModuleName = {
//   [M in UserModule as M['sub_module'][number] extends UserSubModule
//     ? UserSubModule['sub_module_name']
//     : never]: M['sub_module'][number]['sub_module_name'];
// }[keyof UserModule['sub_module'][number]];

// export type UserSubModuleId = {
//   [M in UserModule as M['sub_module'][number] extends UserSubModule
//     ? UserSubModule['sub_module_id']
//     : never]: M['sub_module'][number]['sub_module_id'];
// }[keyof UserModule['sub_module'][number]];

export interface ModuleBusinessType {
  business_id: number;
  business_name: string;
  business_shortname: string;
  application_id: number;
  application_name: string;
  business_logo: string;
}

export interface ModuleUserType {
  first_name: string;
  last_name: string;
  user_type_name: string;
}

export interface UserModule {
  module_id: number;
  module_name: string;
  user_type_id: number;
  access: boolean;
  link: string;
  icon_name: string;
  module_button: ModuleButton[];
  sub_module: UserSubModule[];
}

export interface UserSubModule {
  sub_module_id: number;
  sub_module_name: string;
  user_type_id: number;
  access: boolean;
  link: string;
  icon_name: string;
  sub_module_button: UserSubModuleButton[];
}

export interface UserSubModuleButton {
  sub_module_button: number;
  sub_module_button_name: string;
  user_type_id: number;
  access: boolean;
  link: string;
  icon_name: string;
}

export interface ModuleButton {
  module_button: number;
  module_button_name: string;
  user_type_id: number;
  access: boolean;
  link: string;
  icon_name: string;
}
