import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toUpper(str: string, lang: string = 'en') {
  return str.toLocaleUpperCase(lang === 'tr' ? 'tr-TR' : 'en-US');
}
