import { io } from "socket.io-client";
// import { env } from "~/env";
import { auth } from "~/store/auth.store";

export const socket = io({
	path: "/api/ws",
	auth: { token: auth.accessToken },
});
