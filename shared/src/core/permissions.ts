export const PERMISSIONS = {
	MEMBERS: {
		MY_PROFILE: "members:my_profile",
		ANY_PROFILE: "members:any_profile",
		ALL_PROFILES: "members:all_profiles",
		GET_ROLES: "members:get_roles",
		GET_ROLES_DETAILED: "members:get_roles_detailed",
		CHANGE_ROLES: "members:change_roles",
	},
	ROLES: {
		CREATE: "roles:create",
		EDIT: "roles:edit",
		EDIT_PERMISSIONS: "roles:edit_permissions",
		DELETE: "roles:delete",
		DETAILS: "roles:details",
		LIST: "roles:list",
		LIST_DETAILED: "roles:list_detailed",
		LIST_MEMBERS: "roles:list_members",
	},
	SHIFT: {
		GET_POSITION: "shift:position:get",
		GET_POSITIONS: "shift:positions:get",
		CREATE_POSITION: "shift:position:create",
		EDIT_POSITION: "shift:position:edit",
		DELETE_POSITION: "shift:position:delete",
		GET_TYPE: "shift:type:get",
		GET_TYPES: "shift:types:get",
		CREATE_TYPE: "shift:type:create",
		EDIT_TYPE: "shift:type:edit",
		DELETE_TYPE: "shift:type:delete",
		CREATE_SHIFT: "shift:create",
		EDIT_SHIFT: "shift:edit",
		EDIT_ANY_SHIFT: "shift:edit_any",
		GET_SHIFT: "shift:get",
		GET_SHIFTS: "shift:get_all",
	},
	PERMISSIONS: {
		LIST: "permissions:list",
	},
} as const;

type PermissionValues<T> = T extends object
	? { [K in keyof T]: PermissionValues<T[K]> }[keyof T]
	: T;

export type Permission = PermissionValues<typeof PERMISSIONS>;

export const permissionValues = Object.values(PERMISSIONS).flatMap((group) => Object.values(group)) as [Permission, ...Permission[]];
