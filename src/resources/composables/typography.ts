export function useStringLimiter(str: string, size: number) {
  return str.length <= size ? str : str.substring(0, size) + "...";
}
export function useThousandSeparator(number: number): string {
  const thousandSeparator = Intl.NumberFormat("id");
  return thousandSeparator.format(number);
}
