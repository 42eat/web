import z from "zod";
import { w } from "./builder";
import { deleteShiftWsSchema, shiftSchema } from "../contracts/shifts/schemas/shifts.schema";
import { PERMISSIONS } from "../core/permissions";
import { makeEventRouter } from "./event-builder";
import { foyerContract } from "../contracts/foyer/foyer.contract";

// ";shift;:id;update"
// ".shift.:id.update"
// "🚪shift🚪:id🚪update"
// ">shift>:id>update"
// "|shift|:id|update"
// ":shift:.id:update"
// "\\shift\\:id\\update"
// "<shift<:id<update"
// "{shift{:id{update"
// "}shift}:id}update"
// "-shift-:id-update"
// "#shift#:id#update"
// "%shift%:id%update"
// "@shift@:id@update"
// "?shift?:id?update"
// "/shift/:id/update"
// " shift :id update"
// "^shift^:id^update"
// "^^shift^^:id^^update"
// "_shift_:id_update"
// ",shift,:id,update"
// "!shift!:id!update"
// "$shift$:id$update"
// "[shift[:id[update"
// "]shift]:id]update"
// ")shift):id)update"
// "(shift(:id(update"
// "*shift*:id*update"
// "&shift&:id&update"
// "'shift':id'update"

// const caca = z.coerce.number();

// type Test = `:shift:${z.infer<typeof caca>}:update`;

// const shiftContract = w.router({
// 	shift: {
// 		name: ":id",
// 		params: { id: z.coerce.number() },
// 		permissions: [ PERMISSIONS.SHIFT.GET_SHIFT ],
// 		events: {
// 			update: {
// 				new: {
// 					data: shiftSchema,
// 				},
// 			},
// 		},
// 	},
// 	shiftList: {

// 		name: ".list",
// 		permissions: [ PERMISSIONS.SHIFT.GET_SHIFTS ],
// 		events: {
// 			create: w.event(shiftSchema),
// 			update: w.event(shiftSchema),
// 			delete: w.event(deleteShiftWsSchema),
// 		},
// 	},
// }, { prefix: "shift" });>

// export const socketContract = w.contract({
// 	shift: shiftContract,
// 	global: w.room({
// 		name: "global",
// 		permission: null,
// 		events: {
// 			foyerStatus: w.event(z.boolean()),
// 		},
// 	}),
// });

const shiftContract = w.router({
	byId: {
		name: ":id",
		params: ,
		permissions: [PERMISSIONS.SHIFT.GET_SHIFT],
		events: {
			update: {
				name: "update",
				data: shiftSchema,
			},
			delete: {
				name: "delete",
				data: deleteShiftWsSchema,
			},
		},
	},
	list: {
		name: "list",
		permissions: [PERMISSIONS.SHIFT.GET_SHIFTS],
		events: {
			new: {
				name: "new",
				data: shiftSchema,
			},
			update: {
				name: "update",
				data: shiftSchema,
			},
			delete: {
				name: "delete",
				data: deleteShiftWsSchema,
			},
		},
	},
}, { prefix: "shift" });


const foyeStatusEvent = makeEventRouter({
	status: {
		name: "status",
		data: z.boolean(),
	},
}, { prefix: "foyer" });

export const ws = w.router({
	shifts: shiftContract,
	global: {
		name: "global",
		permissions: [],
		events: {
			foyer: foyeStatusEvent,
		},
	},
});


// void ws.global.events.foyer.status.name;

// void ws.shifts.byId.events.update.name;
// void ws.shifts.byId.name;
