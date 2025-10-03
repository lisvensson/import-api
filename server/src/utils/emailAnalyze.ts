export function emailAnalyze(values: string[]): number {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const totalValue = values.length;
  if (totalValue === 0) return 0;

  const validEmails = values.filter(value => emailRegex.test(value.trim()));
  return (validEmails.length / totalValue);
}