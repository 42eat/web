/* @refresh reload */
import { render } from "solid-js/web";
import { io } from "socket.io-client";
import "solid-devtools";

import "./index.scss";

import App from "./App";

export const socket = io("http://localhost:3001/ws", {
	auth: { token: localStorage.getItem("access_token") },
});

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		"Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
	);
}

render(() => <App />, root!);
