import { UserProfile } from 'types/auth';
import storage from 'utils/storage';
import * as Yup from 'yup';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { user_id, business_id }: UserProfile = storage.getItem('user');

export const budgetInitialValues = {
  accountHead: 0,
  financialYear: 0,
  amount: 0
};
export interface IBudgetInitialValuesProps {
  financialYear: number;
  amount: number;
  accountHead: number;
}

export const formateProjectBudgetPayload = async (values: IBudgetInitialValuesProps, projectId: number) => {
  return {
    project_id: projectId,
    amount: values.amount,
    project_financial_year_id: values.financialYear,
    account_head_id: values.accountHead,
    user_id: user_id
  };
};

export const validationSchema = Yup.object().shape({
  accountHead: Yup.number().min(1, 'Account Head is required'),
  financialYear: Yup.number().min(1, 'Financial Year is required'),
  amount: Yup.number().min(1, 'Amount is required')
});

export interface IProjectBudgetItem {
  id: number;
  project: number;
  project_financial_year: string;
  amount: string;
  account_head_id: number;
  account_head_name: string;
}
