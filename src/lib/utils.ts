import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function cx(...inputs: ClassValue[]) {
	return clsx(inputs);
}

// 使用 utools API 检测平台
export const isMacOS = typeof window !== 'undefined' && window.utools
	? window.utools.isMacOs()
	: navigator.platform.toLowerCase().includes('mac');

export function formatLargeNumber(num: number): string {
	if (num >= 1e9) {
		return (num / 1e9).toFixed(1) + "B";
	} else if (num >= 1e6) {
		return (num / 1e6).toFixed(1) + "M";
	} else if (num >= 1e3) {
		return (num / 1e3).toFixed(1) + "K";
	}
	return num.toString();
}
