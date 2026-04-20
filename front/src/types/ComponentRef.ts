export interface ComponentRef<E extends HTMLElement = HTMLElement> {
	htmlElement: E;
}

interface InputComponentRefProperty {
	checkErrors: () => void;
}

export type InputComponentRef = ComponentRef<HTMLInputElement> & InputComponentRefProperty;
