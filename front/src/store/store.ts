import { createStore } from "solid-js/store";
import { client } from "~/api/client";
import { socket } from "~/api/socket";

const [store, setStore] = createStore({
	foyerOpen: false,
});

function setFoyerOpen(open: boolean) {
	setStore("foyerOpen", open);
}

(window as unknown as { setFoyerOpen: typeof setFoyerOpen }).setFoyerOpen = setFoyerOpen;

void client.foyer.getStatus.query().then((status) => {
	if(status.status === 200 && status.body.open) {
		setFoyerOpen(true);
	}
});

socket.on("connect", () => {
	socket.emit("join", "global");
	console.log("Room joined");
});

socket.on("foyer.status", (data: boolean) => {
	setFoyerOpen(data);
	console.log(data);
});

export { store, setFoyerOpen };
