import { createStore } from "solid-js/store";

const [store, setStore] = createStore({
	foyerOpen: false,
});

function setFoyerOpen(open: boolean) {
	setStore("foyerOpen", open);
}

(window as unknown as { setFoyerOpen: typeof setFoyerOpen }).setFoyerOpen = setFoyerOpen;

export { store, setFoyerOpen };
