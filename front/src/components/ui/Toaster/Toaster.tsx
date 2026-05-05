import { createRoot, createSignal, For, JSXElement } from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import "./Toaster.scss";

const DEFAULT_TTL = 3000;

interface SummonToastOptions {
	customClass?: string;
	/** The time the Toast stay in ms. */
	ttl?: number;
	ref?: (element: HTMLDialogElement) => void;
}

interface Toast {
	id: number;
	element: JSXElement;
	remove: () => void;
}

const { toasts, setToasts } = createRoot(() => {
	const [toasts, setToasts] = createSignal<Toast[]>([]);
	return { toasts, setToasts };
});

let toastId = 0;

export function summonToast(content: JSXElement, options?: SummonToastOptions): Toast {
	const ttl = options?.ttl ?? DEFAULT_TTL;
	const thisToastId = toastId++;

	function removeToast() {
		setToasts((prev) => prev.filter((toast) => toast.id !== thisToastId));
	}

	const deleteTimeoutId = setTimeout(removeToast, ttl);

	const newToast = {
		id: thisToastId,
		element: content,
		remove: () => {
			clearTimeout(deleteTimeoutId);
			removeToast();
		}
	}

	setToasts((prev) => [...prev, newToast]);

	return newToast;
}

(window as unknown as { summonToast: typeof summonToast }).summonToast = () => summonToast(<div style={{ padding: "5px", background: "red" }}>TEST</div>);

export function ToasterProvider(props: { children: JSXElement }) {
	return <>
		<div id="toast-container" class="">
			<TransitionGroup name="toast-wrapper" onExit={(_, done) => setTimeout(done, 1000)}>
				<For each={toasts()}>{(toast) => <div onClick={toast.remove}>{toast.element}</div>}</For>
			</TransitionGroup>
		</div>
		{props.children}
	</>;
}
