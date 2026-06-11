import { defineEvent, defineRoom, defineSocketContract } from "./builders";
// , resolveRoom, parseRoomParams
export const w = {
	event: defineEvent,
	room: defineRoom,
	contract: defineSocketContract,
	// resolve: resolveRoom,
	// parseParams: parseRoomParams,
} as const;

// export type { RoomName, RoomParams, EventName, EventPayload } from "./contract";
