export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as Thai mobile number: +66 XX XXX XXXX
  if (cleaned.length === 10) {
    return `+66 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
      6
    )}`;
  }
  // Return original if not matching expected format
  return phone;
};
