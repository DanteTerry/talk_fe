import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const trimString = (str: string, length: number = 27) => {
  return str.length > length ? str.substring(0, length) + "..." : str;
};
