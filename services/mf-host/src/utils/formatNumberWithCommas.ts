export const formatNumberWithCommas = (value: string) => {
  const cleanedValue = value.replace(/[^\d.]/g, "");
  return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
