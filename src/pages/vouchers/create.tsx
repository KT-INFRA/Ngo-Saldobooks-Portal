/* eslint-disable array-callback-return */
// material-ui
import { MenuItem, Stack } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { FormHelperText } from '@mui/material';
import { FormControl } from '@mui/material';
import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { IVoucherType, VoucherTypes } from 'data/vouchers';
import { useFormik } from 'formik';
import { useCallback, useMemo, useRef } from 'react';
import SelectVoucher from 'sections/vouchers/select-voucher';
import AdvanceMngtVoucher from 'sections/vouchers/voucher-forms/advance-mngt-voucher/advance-employee/create';
import IssueInternalLoanVoucher from 'sections/vouchers/voucher-forms/issue-internal-loan/create';
import AddFundingAgencyVoucher from 'sections/vouchers/voucher-forms/credit-vouchers/funding-agency/create';
import AddBankInterestVoucher from 'sections/vouchers/voucher-forms/credit-vouchers/bank-interest-voucher/create';
import BankInterestTransferVoucher from 'sections/vouchers/voucher-forms/debit-vouchers/bank-interest-transfer/create';
import EmployeeVoucher from 'sections/vouchers/voucher-forms/debit-vouchers/employee-voucher/create';
import JRFFellowshipVoucher from 'sections/vouchers/voucher-forms/debit-vouchers/jrf-voucher/create';
import ProjectToProjectVoucher from 'sections/vouchers/voucher-forms/debit-vouchers/project-to-project-voucher/create';
import VendorVoucher from 'sections/vouchers/voucher-forms/debit-vouchers/vendor-voucher/create';
import AddOtherSourceVoucher from 'sections/vouchers/voucher-forms/credit-vouchers/other-source/create';
import AddBankChargesVoucher from 'sections/vouchers/voucher-forms/debit-vouchers/bank-charges-voucher/create';

interface IFormValue {
  voucherType: number;
  voucher: number;
}
export default function CreateVoucher() {
  const { values, handleChange, touched, errors, setFieldValue } = useFormik<IFormValue>({
    initialValues: {
      voucherType: 0,
      voucher: 0
    },
    onSubmit: () => {}
  });

  const vouchers = useMemo(() => {
    return VoucherTypes.find((voucher) => voucher.id === values.voucherType)?.children || [];
  }, [values.voucherType]);

  const voucherTypeRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getFormComponent = useCallback(() => {
    // Early return for common case
    if (values.voucher === 0) {
      return SelectVoucher;
    }

    const voucherType = values.voucherType;
    const voucher = values.voucher;

    // Use a switch statement with fallthrough for efficiency
    switch (voucherType) {
      case 1:
        switch (voucher) {
          case 1:
            return AddFundingAgencyVoucher;
          case 2:
            return AddBankInterestVoucher;
          case 3:
            return AddOtherSourceVoucher;
        }
        break;
      case 2:
        switch (voucher) {
          case 1:
            return VendorVoucher;
          case 2:
            return EmployeeVoucher;
          case 3:
            return JRFFellowshipVoucher;
          case 4:
            return BankInterestTransferVoucher;
          case 5:
            return ProjectToProjectVoucher;
          case 6:
            return AddBankChargesVoucher; // Combine cases 5 and 6
        }
        break;
      case 3:
        if (voucher === 1) {
          return AdvanceMngtVoucher;
        }
        break;
      case 4:
        if (voucher === 1) {
          return IssueInternalLoanVoucher;
        }
        break;
      default:
        return SelectVoucher;
    }

    // If no match found, return SelectVoucher
    return SelectVoucher;
  }, [values.voucherType, values.voucher]);

  const FormComponent = getFormComponent();

  const handleChangeVoucherType = (value: any) => {
    handleChange(value);
    setFieldValue('voucher', 0);
    const children = VoucherTypes.find((voucher) => voucher.id === value.target.value)?.children || [];
    if (children.length === 1) {
      setFieldValue('voucher', children[0].id);
    }
  };

  return (
    <>
      <Stack gap={1}>
        <MainCard>
          <Grid spacing={2} container>
            <Grid item xs={12} sm={6} md={6}>
              <Stack spacing={1}>
                <InputLabel>Voucher Type</InputLabel>
                <FormControl sx={{ width: '100%' }}>
                  <Select
                    value={values.voucherType}
                    displayEmpty
                    inputRef={voucherTypeRef}
                    name="voucherType"
                    defaultOpen={true}
                    onChange={handleChangeVoucherType}
                    error={Boolean(errors.voucherType && touched.voucherType)}
                  >
                    <MenuItem disabled value="0">
                      Select Voucher Type
                    </MenuItem>
                    {VoucherTypes.map((voucherType: IVoucherType, index: number) => {
                      return (
                        <MenuItem key={voucherType.id} value={voucherType.id}>
                          {voucherType.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>
              {touched.voucherType && errors.voucherType && <FormHelperText error={true}>{errors?.voucherType}</FormHelperText>}
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Stack spacing={1}>
                <InputLabel>Select Voucher</InputLabel>
                <FormControl sx={{ width: '100%' }}>
                  <Select
                    value={values.voucher}
                    displayEmpty
                    disabled={vouchers.length === 0}
                    name="voucher"
                    onChange={handleChange}
                    error={Boolean(errors.voucher && touched.voucher)}
                  >
                    <MenuItem disabled value={0}>
                      Select Voucher
                    </MenuItem>
                    {vouchers.map((voucher: IVoucherType, index: number) => {
                      if (voucher?.hasAccess) {
                        return (
                          <MenuItem key={voucher.id} value={voucher.id}>
                            {voucher.name}
                          </MenuItem>
                        );
                      }
                    })}
                  </Select>
                </FormControl>
              </Stack>
              {touched.voucher && errors.voucher && <FormHelperText error={true}>{errors.voucher}</FormHelperText>}
            </Grid>
          </Grid>
        </MainCard>
        <Stack mt={1}>{FormComponent && <FormComponent />}</Stack>
      </Stack>
    </>
  );
}
