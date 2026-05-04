import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Note: Even though we don't use Tailwind CSS for styling, 
// tailwind-merge can still be useful for merging standard class names if needed.
// However, since we are using SCSS, we might just need clsx.

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}
