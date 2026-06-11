import { z } from "zod";
import { w } from "./index";
import { PERMISSIONS } from "../core/permissions";
import { idParamSchema } from "../contracts/schemas/common.schema";
import { deleteShiftWsSchema, shiftSchema } from "../contracts/shifts/schemas/shifts.schema";
// import { ParamSchema } from "./builders";

export const socketContract = w.contract([

	w.room({
		name: "shift.:id",
		params: { id: idParamSchema },
		permission: PERMISSIONS.SHIFT.GET_SHIFT,
		events: [
			w.event("shift.updated", shiftSchema),
			w.event("shift.deleted", deleteShiftWsSchema),
		],
	}),

	w.room({
		name: "shift.list",
		permission: PERMISSIONS.SHIFT.GET_SHIFTS,
		events: [
			w.event("shift.created", shiftSchema),
			w.event("shift.updated", shiftSchema),
			w.event("shift.deleted", deleteShiftWsSchema),
		],
	}),

	w.room({
		name: "global",
		permission: null,
		events: [
			w.event("foyer.status", z.object({ open: z.boolean() })),
			w.event("auth.token_expired", null),
		],
	}),

]);


// type ContractRooms = typeof socketContract.rooms[number];

// export type RoomName = ContractRooms["name"];

// export type RoomParams<TName extends RoomName> = Extract<
// 	ContractRooms,
// 	{ name: TName }
// >["params"] extends infer P
// 	? P extends ParamSchema
// 		? { [K in keyof P]: z.infer<P[K]> }
// 		: null
// 	: never;

// type RoomEvents<TName extends RoomName>
// 	= Extract<ContractRooms, { name: TName }>["events"][number];

// export type EventName<TName extends RoomName>
// 	= RoomEvents<TName>["name"];

// export type EventPayload<
// 	TRoomName extends RoomName,
// 	TEventName extends EventName<TRoomName>,
// > = Extract<RoomEvents<TRoomName>, { name: TEventName }>["schema"] extends infer S
// 	? S extends null
// 		? null
// 		: S extends z.ZodType<any, any, any>
// 			? z.infer<S>
// 			: never
// 	: never;

// export function resolveRoom<TName extends RoomName>(
// 	name: TName,
// 	params: RoomParams<TName>,
// ): string {
// 	if (!params) return name;
// 	return name.replace(/:(\w+)/g, (_, key: string) => String((params as Record<string, unknown>)[key]));
// }
