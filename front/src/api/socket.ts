import { io } from "socket.io-client";
import { env } from "~/env";

export const socket = io(`${env.VITE_API_URL}/ws`, {
	auth: { token: localStorage.getItem("access_token") },
});
