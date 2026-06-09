import { Permission, PERMISSIONS } from "@42eat-web/shared";

type RoomDefinition = {
	permission: Permission | null;
	validateId?: (id: string) => boolean;
};

export const ROOM_DEFINITIONS = {
	"profile": {
		permission: PERMISSIONS.MEMBERS.ANY_PROFILE,
		validateId: (id) => Number.isInteger(Number(id)),
	},
	"members:list": {
		permission: PERMISSIONS.MEMBERS.ALL_PROFILES,
	},
	"global": {
		permission: null,
	},
} satisfies Record<string, RoomDefinition>;

export type RoomPrefix = keyof typeof ROOM_DEFINITIONS;
