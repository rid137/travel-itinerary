import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const returnCapitalize = (text: string) => {
  if (!text) {
    return '';
  }
  return text?.charAt(0)?.toUpperCase() + text?.slice(1).toLowerCase();
};

export const truncateSentence = (str: string, char: number) => {
  if (str?.length > char) {
    str = str.substring(0, char) + '...';
  }
  return str;
};

export const getCurrencySymbol = (code: string): string => {
  const currencyMap: Record<string, string> = {
    USD: "$",
    EUR: "€",   
    GBP: "£",   
    INR: "₹",  
    AED: "د.إ",
  };

  return currencyMap[code] || code;
}