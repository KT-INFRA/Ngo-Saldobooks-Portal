import { reportsLayouts } from 'data/reports';
import dayjs from 'dayjs';
import * as Yup from 'yup';

export interface IReportFormInitialValuesProps {
  projectId: number;
  month: number;
  financialYear: number;
  year: number;
  fromDate: string | null;
  toDate: string | null;
  selectedReport: string;
  selectedLayout: number;
}

export const reportFormInitialValues: IReportFormInitialValuesProps = {
  projectId: 0,
  month: 0,
  year: new Date().getFullYear(),
  financialYear: 0,
  fromDate: dayjs(new Date()).format('YYYY-MM-DD'),
  toDate: dayjs(new Date()).format('YYYY-MM-DD'),
  selectedReport: '',
  selectedLayout: 0
};

/**
 * Given the form values, returns the selected report.
 *
 * @param values The form values.
 * @returns The selected report.
 */
const getSelectedReport = (values: IReportFormInitialValuesProps) => {
  const selectedLayout = reportsLayouts.find((report) => report.id === values.selectedLayout);
  const selectedReport = selectedLayout?.children?.find((report) => report.key === values.selectedReport);
  return selectedReport;
};

/**
 * Creates a dynamic Yup schema based on the selected report.
 * @param values The form values.
 * @returns A Yup schema.
 */
export const createDynamicSchema = (values: IReportFormInitialValuesProps) => {
  const selectedReportObj = getSelectedReport(values);
  return Yup.object().shape({
    projectId: selectedReportObj?.hasProjectId ? Yup.number().min(1, 'Project is required').required('Project is required') : Yup.number(),
    month: selectedReportObj?.hasMonth ? Yup.number().min(1, 'Month is required').required('Month is required') : Yup.number(),

    financialYear: selectedReportObj?.hasFinancialYear
      ? Yup.number().min(1, 'Financial Year is required').required('Financial Year is required')
      : Yup.number(),

    fromDate: selectedReportObj?.hasDate ? Yup.date().required('From date is required') : Yup.date(),

    toDate: selectedReportObj?.hasDate ? Yup.date().required('To date is required') : Yup.date(),
    year: selectedReportObj?.hasMonth ? Yup.number().required('Year is required') : Yup.number()
  });
};

/**
 * Format the payload for the report generation API.
 * @param values The form values.
 * @returns The formatted payload.
 */
export const formatePayload = (values: IReportFormInitialValuesProps) => {
  return {
    business_id: 1,
    user_id: 1,
    project_id: values.projectId
  };
};
