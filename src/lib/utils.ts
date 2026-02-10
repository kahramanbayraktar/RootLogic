import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toUpper(str: string, lang: string = 'en') {
  return str.toLocaleUpperCase(lang === 'tr' ? 'tr-TR' : 'en-US');
}

export function slugify(text: string): string {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ş': 's', 'ü': 'u', 'ö': 'o', 'ı': 'i',
    'Ç': 'c', 'Ğ': 'g', 'Ş': 's', 'Ü': 'u', 'Ö': 'o', 'İ': 'i'
  };

  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (excluding spaces and hyphens)
    .replace(/[\s_]+/g, '-')  // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '')  // Remove leading/trailing hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with a single one
}
