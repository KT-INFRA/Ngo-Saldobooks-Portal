import { AdvanceDetailList } from 'types/vouchers';

export const generateUniqueId = () => Math.round(Math.random() * 9999999).toString();
export const generateInitialItem = (data: AdvanceDetailList[] = []) => {
  return {
    items: data
      .map((advance) => {
        if (advance?.settled_details.length > 0) {
          return advance?.settled_details?.map((item) => {
            return {
              id: generateUniqueId(),
              employee_id: advance?.id,
              amount: +item?.bill_amount,
              account_head_id: item?.account_head_id
            };
          });
        } else {
          return [
            // {
            //   id: generateUniqueId(),
            //   employee_id: advance?.id,
            //   amount: '',
            //   account_head_id: 0
            // }
          ];
        }
      })
      ?.flat()
  };
};
