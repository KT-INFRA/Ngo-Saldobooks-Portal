import { UserModuleResponseType } from 'types/auth';

export interface LoginResponse {
  token: string;
  business_id: number;
  application_id: number;
  user_id: number;
  prefix: string;
  username: string;
  password: string;
  user_first_name: string;
  user_last_name: string;
  user_type_id: number;
  user_type_name: string;
  is_executive: boolean;
  access_module: UserModuleResponseType;
}
