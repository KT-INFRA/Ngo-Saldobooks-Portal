interface CurrencyProp {
  label?: boolean;
  decimal?: boolean;
}
export const formateCurrency = (
  amount: number | string | null | undefined,
  options?: CurrencyProp | undefined
): string => {
  const showLabel = options?.label ? options?.label : false;
  const removeDecimals = !options?.decimal;
  // Convert amount to number and handle non-numeric cases
  const formattedAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  // Return '0' if amount is null or NaN
  if (
    formattedAmount === null ||
    formattedAmount === undefined ||
    isNaN(formattedAmount)
  ) {
    return "0";
  }

  // Handle formatted output without labels
  if (!showLabel) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: removeDecimals ? 0 : 2, // Control decimal digits
      maximumFractionDigits: removeDecimals ? 0 : 2,
    }).format(formattedAmount);
  }

  // Format the number with labels
  const absAmount = Math.abs(formattedAmount);
  let result: string;

  if (absAmount >= 1e7) {
    // Greater than or equal to 1 crore
    result = (formattedAmount / 1e7).toFixed(removeDecimals ? 0 : 2) + " cr";
  } else if (absAmount >= 1e5) {
    // Greater than or equal to 1 lakh
    result = (formattedAmount / 1e5).toFixed(removeDecimals ? 0 : 2) + " lac";
  } else if (absAmount >= 1e3) {
    // Greater than or equal to 1000
    result = (formattedAmount / 1e3).toFixed(removeDecimals ? 0 : 2) + " k";
  } else {
    // Below 1000, format as currency
    result = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: removeDecimals ? 0 : 2, // Control decimal digits
      maximumFractionDigits: removeDecimals ? 0 : 2,
    }).format(formattedAmount);
  }

  return result;
};
