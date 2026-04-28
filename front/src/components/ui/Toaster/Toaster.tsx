import { createSignal, For, JSXElement } from "solid-js";

const DEFAULT_TTL = 5000;

interface SummonToastOptions {
	customClass?: string;
	/** The time the Toast stay in ms */
	ttl?: number;
	ref?: (element: HTMLDialogElement) => void;
}

interface Toast {
	element: JSXElement;
	deathTime: number;
}

const [toasts, setToasts] = createSignal<Toast[]>([]);

export function summonToast(content: JSXElement, options?: SummonToastOptions) {
	const ttl = options?.ttl ?? DEFAULT_TTL;
	setToasts((prev) => [...prev, { element: content, deathTime: Date.now() + ttl }]);
}

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
