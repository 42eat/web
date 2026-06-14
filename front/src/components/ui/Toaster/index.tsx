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

export * from "./Toaster";
