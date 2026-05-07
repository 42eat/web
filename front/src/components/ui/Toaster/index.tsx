import { Tail } from "~/types/generics/Tail";
import { summonToast } from "./summonToast";

export function summonSuccessToast(...args: Tail<Parameters<typeof summonToast>>) {
	return summonToast("success", ...args);
}

export function summonInfoToast(...args: Tail<Parameters<typeof summonToast>>) {
	return summonToast("info", ...args);
}

export function summonWarningToast(...args: Tail<Parameters<typeof summonToast>>) {
	return summonToast("warning", ...args);
}

export function summonErrorToast(...args: Tail<Parameters<typeof summonToast>>) {
	return summonToast("error", ...args);
}

(window as (typeof window & { summonErrorToast: typeof summonErrorToast })).summonErrorToast = summonErrorToast;
(window as (typeof window & { summonInfoToast: typeof summonInfoToast })).summonInfoToast = summonInfoToast;

export * from "./Toaster";
