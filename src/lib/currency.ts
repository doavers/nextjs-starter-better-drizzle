export function formatCurrency(amount: number, currency = "IDR") {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0, // No decimal places for IDR
  }).format(amount);
}
