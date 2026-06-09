import { A } from "@solidjs/router";
import { socket } from "~/index";

export default function Landing() {
	socket.on("connect", () => {
		socket.emit("join", `profile:${1}`);
		console.log("Room joined");
	});

	socket.on("profile.updated", (data) => {
		console.log("OEOEOEO", data);
	});

	return <div style={{ background: "red" }}>Landing<br/><A href="/home">Go to Home</A></div>;
}
