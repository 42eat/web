import { createSignal, For, JSXElement } from "solid-js";

const DEFAULT_TTL = 1000;

interface SummonToastOptions {
	customClass?: string;
	/** The time the Toast stay in ms. */
	ttl?: number;
	ref?: (element: HTMLDialogElement) => void;
}

interface Toast {
	id: number;
	element: JSXElement;
	deathTime: number;
}

const [toasts, setToasts] = createSignal<Toast[]>([]);

let toastId = 0;

export function summonToast(content: JSXElement, options?: SummonToastOptions) {
	const ttl = options?.ttl ?? DEFAULT_TTL;
	const thisToastId = toastId++;
	setToasts((prev) => [...prev, { id: thisToastId, element: content, deathTime: Date.now() + ttl }]);
	setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== thisToastId)), ttl);
}

(window as unknown as { summonToast: typeof summonToast }).summonToast = (() => summonToast(<div style={{ padding: "5px", background: "red" }}>TEST</div>));

export function ToasterProvider(props: { children: JSXElement }) {
	return <>
		<div class="toast-container">
			<For each={toasts()}>
				{(toast) => <div style={{ background: "red", padding: "1rem" }}>
					{toast.element}
				</div>}
			</For>
		</div>
		{props.children}
	</>;
}
