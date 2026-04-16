export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPrice(
  price: string | number | null | undefined,
  currency: string | null | undefined,
): string {
  if (price === null || price === undefined || price === '') return '';
  const num = typeof price === 'string' ? Number(price) : price;
  if (Number.isNaN(num)) return '';
  return `${num.toFixed(2)} ${currency ?? ''}`.trim();
}
