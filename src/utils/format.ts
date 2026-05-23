export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return `${start.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })} - ${end.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })}`;
};

export const splitCommaList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
