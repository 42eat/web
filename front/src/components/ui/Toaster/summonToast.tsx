import { summonRawToast, Toast } from "./Toaster";
import "./Toast.scss";

type ToastVariant = "success" | "info" | "warning" | "error";


export function summonToast(type: ToastVariant, ...[content, options]: Parameters<typeof summonRawToast>): Toast {
	return summonRawToast(<div class={`default-toast--${type}`}>{content}</div>, options);
}
