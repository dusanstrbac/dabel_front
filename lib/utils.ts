import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Ulits za Shadcn

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
